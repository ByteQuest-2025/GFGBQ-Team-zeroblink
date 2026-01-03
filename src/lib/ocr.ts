import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  documentType: string | null;
  extractedData: Record<string, string>;
  isValid: boolean;
  error?: string;
}

// Document type patterns for validation
const DOCUMENT_PATTERNS = {
  aadhaar: {
    keywords: ['aadhaar', 'uidai', 'unique identification', 'government of india', 'आधार'],
    patterns: [
      /\d{4}\s?\d{4}\s?\d{4}/, // Aadhaar number pattern
      /DOB|Date of Birth|जन्म तिथि/i,
    ],
    extractors: {
      aadhaarNumber: /(\d{4}\s?\d{4}\s?\d{4})/,
      dob: /(?:DOB|Date of Birth)[:\s]*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
      name: /(?:Name|नाम)[:\s]*([A-Za-z\s]+)/i,
    }
  },
  salary: {
    keywords: ['salary', 'payslip', 'pay slip', 'earnings', 'deductions', 'net pay', 'gross', 'basic'],
    patterns: [
      /(?:net|gross)\s*(?:pay|salary)/i,
      /(?:basic|hra|da|allowance)/i,
    ],
    extractors: {
      grossSalary: /(?:gross|total)\s*(?:pay|salary|earnings)[:\s]*(?:Rs\.?|₹)?\s*([\d,]+)/i,
      netSalary: /(?:net)\s*(?:pay|salary)[:\s]*(?:Rs\.?|₹)?\s*([\d,]+)/i,
      month: /(?:month|period)[:\s]*([A-Za-z]+\s*\d{4})/i,
      employeeName: /(?:employee|name)[:\s]*([A-Za-z\s]+)/i,
    }
  },
  marksheet: {
    keywords: ['marksheet', 'mark sheet', 'grade', 'result', 'examination', 'university', 'college', 'semester', 'cgpa', 'percentage'],
    patterns: [
      /(?:cgpa|gpa|percentage|marks)/i,
      /(?:pass|fail|distinction|first class)/i,
    ],
    extractors: {
      studentName: /(?:name|student)[:\s]*([A-Za-z\s]+)/i,
      rollNumber: /(?:roll|reg|enrollment)\s*(?:no|number)?[:\s]*([A-Za-z0-9]+)/i,
      percentage: /(?:percentage|marks)[:\s]*(\d+(?:\.\d+)?)\s*%?/i,
      cgpa: /(?:cgpa|gpa)[:\s]*(\d+(?:\.\d+)?)/i,
      degree: /(?:degree|course|program)[:\s]*([A-Za-z\.\s]+)/i,
    }
  },
  pan: {
    keywords: ['permanent account number', 'income tax', 'pan', 'govt of india'],
    patterns: [
      /[A-Z]{5}\d{4}[A-Z]/, // PAN number pattern
    ],
    extractors: {
      panNumber: /([A-Z]{5}\d{4}[A-Z])/,
      name: /(?:name|नाम)[:\s]*([A-Za-z\s]+)/i,
      fatherName: /(?:father|पिता)[:\s]*([A-Za-z\s]+)/i,
      dob: /(?:DOB|Date of Birth)[:\s]*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
    }
  },
};

export async function performOCR(
  imageFile: File,
  expectedDocumentType: string,
  onProgress?: (progress: number, status: string) => void
): Promise<OCRResult> {
  try {
    onProgress?.(5, 'Initializing OCR engine...');
    
    // Create image URL
    const imageUrl = URL.createObjectURL(imageFile);
    
    onProgress?.(15, 'Loading Tesseract worker...');
    
    // Perform OCR
    const result = await Tesseract.recognize(
      imageUrl,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(15 + (m.progress * 50));
            onProgress?.(progress, 'Extracting text from document...');
          }
        }
      }
    );

    // Clean up
    URL.revokeObjectURL(imageUrl);

    onProgress?.(70, 'Analyzing document content...');
    
    const text = result.data.text;
    const confidence = result.data.confidence;

    // Detect document type
    onProgress?.(80, 'Validating document type...');
    const detectedType = detectDocumentType(text);
    
    // Validate against expected type
    const isValid = detectedType === expectedDocumentType;
    
    if (!isValid) {
      return {
        text,
        confidence,
        documentType: detectedType,
        extractedData: {},
        isValid: false,
        error: detectedType 
          ? `Document appears to be a ${formatDocumentType(detectedType)}, but you selected ${formatDocumentType(expectedDocumentType)}`
          : `Could not identify document type. Please upload a valid ${formatDocumentType(expectedDocumentType)}`
      };
    }

    onProgress?.(90, 'Extracting document data...');
    
    // Extract data based on document type
    const extractedData = extractDocumentData(text, expectedDocumentType);
    
    onProgress?.(100, 'Document processed successfully!');

    return {
      text,
      confidence,
      documentType: detectedType,
      extractedData,
      isValid: true,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      text: '',
      confidence: 0,
      documentType: null,
      extractedData: {},
      isValid: false,
      error: 'Failed to process document. Please try again with a clearer image.',
    };
  }
}

function detectDocumentType(text: string): string | null {
  const lowerText = text.toLowerCase();
  
  let bestMatch: { type: string; score: number } | null = null;
  
  for (const [docType, config] of Object.entries(DOCUMENT_PATTERNS)) {
    let score = 0;
    
    // Check keywords
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        score += 2;
      }
    }
    
    // Check patterns
    for (const pattern of config.patterns) {
      if (pattern.test(text)) {
        score += 3;
      }
    }
    
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { type: docType, score };
    }
  }
  
  // Require minimum score for confidence
  return bestMatch && bestMatch.score >= 3 ? bestMatch.type : null;
}

function extractDocumentData(text: string, documentType: string): Record<string, string> {
  const config = DOCUMENT_PATTERNS[documentType as keyof typeof DOCUMENT_PATTERNS];
  if (!config) return {};
  
  const extractedData: Record<string, string> = {};
  
  for (const [field, pattern] of Object.entries(config.extractors)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      extractedData[field] = match[1].trim();
    }
  }
  
  return extractedData;
}

function formatDocumentType(type: string): string {
  const formats: Record<string, string> = {
    aadhaar: 'Aadhaar Card',
    salary: 'Salary Slip',
    marksheet: 'Marksheet',
    pan: 'PAN Card',
  };
  return formats[type] || type;
}

// For PDF files, we'd need pdf.js to extract images first
export async function processPDF(_file: File): Promise<File[]> {
  // In production, use pdf.js to extract pages as images
  // For now, return empty array (PDF support would need additional implementation)
  console.warn('PDF processing not fully implemented');
  return [];
}
