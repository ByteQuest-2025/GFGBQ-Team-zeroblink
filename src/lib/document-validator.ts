// Document validation using Gemini API

export type DocumentType = 'aadhaar' | 'pan' | 'marksheet' | 'salary_slip';

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  detectedType: string;
  message: string;
}

const DOCUMENT_TYPE_NAMES: Record<DocumentType, string> = {
  aadhaar: 'Aadhaar Card',
  pan: 'PAN Card',
  marksheet: 'Marksheet/Grade Sheet',
  salary_slip: 'Salary Slip'
};

const DOCUMENT_PROMPTS: Record<DocumentType, string> = {
  aadhaar: `You are a document verification expert. Analyze this image carefully.

TASK: Determine if this is an Indian Aadhaar card.

AADHAAR CARD CHARACTERISTICS:
- UIDAI logo or "Unique Identification Authority of India" text
- 12-digit Aadhaar number (format: XXXX XXXX XXXX)
- Person's photograph
- Name, Date of Birth, Gender
- Address details
- QR code (usually present)
- "Government of India" text

IMPORTANT: If this is a marksheet, resume, salary slip, PAN card, or any other document - it is NOT an Aadhaar card.

Respond with ONLY this JSON format:
{"isValid": true/false, "confidence": 0-100, "detectedType": "what document this actually is", "reason": "brief explanation"}`,

  pan: `You are a document verification expert. Analyze this image carefully.

TASK: Determine if this is an Indian PAN card.

PAN CARD CHARACTERISTICS:
- "INCOME TAX DEPARTMENT" or "GOVT. OF INDIA" header
- 10-character PAN number (format: AAAAA0000A - 5 letters, 4 numbers, 1 letter)
- Person's photograph
- Name, Father's name, Date of Birth
- Signature
- Hologram (on physical cards)

IMPORTANT: If this is a marksheet, resume, salary slip, Aadhaar card, or any other document - it is NOT a PAN card.

Respond with ONLY this JSON format:
{"isValid": true/false, "confidence": 0-100, "detectedType": "what document this actually is", "reason": "brief explanation"}`,

  marksheet: `You are a document verification expert. Analyze this image carefully.

TASK: Determine if this is an educational marksheet or grade sheet.

MARKSHEET CHARACTERISTICS:
- Educational institution name/logo (university, college, board)
- Student name and roll number
- List of subjects with marks/grades
- Total marks, percentage, or CGPA
- Examination name and year
- Official seal or signature

IMPORTANT: If this is an Aadhaar card, PAN card, salary slip, resume, or any other document - it is NOT a marksheet.

Respond with ONLY this JSON format:
{"isValid": true/false, "confidence": 0-100, "detectedType": "what document this actually is", "reason": "brief explanation"}`,

  salary_slip: `You are a document verification expert. Analyze this image carefully.

TASK: Determine if this is a salary slip or pay slip.

SALARY SLIP CHARACTERISTICS:
- Company/employer name and logo
- Employee name and ID
- Pay period (month/year)
- Earnings breakdown (Basic, HRA, DA, allowances)
- Deductions (PF, ESI, TDS, etc.)
- Net pay/take-home salary
- Usually has a tabular format

IMPORTANT: If this is an Aadhaar card, PAN card, marksheet, resume, or any other document - it is NOT a salary slip.

Respond with ONLY this JSON format:
{"isValid": true/false, "confidence": 0-100, "detectedType": "what document this actually is", "reason": "brief explanation"}`
};

export async function validateDocument(
  imageBase64: string,
  expectedType: DocumentType
): Promise<ValidationResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const expectedTypeName = DOCUMENT_TYPE_NAMES[expectedType];
  
  if (!apiKey) {
    console.warn('Gemini API key not configured');
    return {
      isValid: false,
      confidence: 0,
      detectedType: 'unknown',
      message: 'Document validation is not configured. Please contact support.'
    };
  }

  try {
    // Remove data URL prefix if present and detect mime type
    let base64Data = imageBase64;
    let mimeType = 'image/jpeg';
    
    if (imageBase64.startsWith('data:')) {
      const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        base64Data = matches[2];
      }
    }
    
    // Ensure mime type is supported
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimeType)) {
      mimeType = 'image/jpeg';
    }
    
    console.log(`Validating document: expecting ${expectedType}`);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: DOCUMENT_PROMPTS[expectedType] },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error details:', errorData);
      
      // Don't allow proceeding on API errors - require validation
      return {
        isValid: false,
        confidence: 0,
        detectedType: 'unknown',
        message: 'Unable to validate document. Please try again or check your internet connection.'
      };
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('Gemini raw response:', text);
    
    // Clean up the text
    text = text.trim();
    if (text.startsWith('"') && text.endsWith('"')) {
      text = text.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n');
    }
    
    // Parse JSON from response
    let result = null;
    
    // Try direct parse first
    try {
      result = JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown code block
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        try {
          result = JSON.parse(codeBlockMatch[1].trim());
        } catch {}
      }
      
      // Try to find JSON object in text
      if (!result) {
        const jsonMatch = text.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch {}
        }
      }
    }
    
    if (!result) {
      console.error('Could not parse JSON from response:', text);
      return {
        isValid: false,
        confidence: 0,
        detectedType: 'unknown',
        message: 'Unable to analyze document. Please ensure the image is clear and try again.'
      };
    }
    
    console.log('Parsed validation result:', result);
    
    // Strict validation: isValid must be explicitly true AND confidence must be >= 60
    const isDocumentValid = result.isValid === true && (result.confidence || 0) >= 60;
    
    if (isDocumentValid) {
      return {
        isValid: true,
        confidence: result.confidence || 0,
        detectedType: result.detectedType || expectedType,
        message: `Document verified as ${expectedTypeName}`
      };
    } else {
      // Document doesn't match expected type
      const detectedType = result.detectedType || 'unknown document';
      const reason = result.reason || '';
      
      return {
        isValid: false,
        confidence: result.confidence || 0,
        detectedType: detectedType,
        message: `This doesn't appear to be a ${expectedTypeName}. ${detectedType !== 'unknown document' ? `Detected: ${detectedType}.` : ''} ${reason}`.trim()
      };
    }
  } catch (error) {
    console.error('Document validation error:', error);
    // Don't allow proceeding on errors - require successful validation
    return {
      isValid: false,
      confidence: 0,
      detectedType: 'unknown',
      message: 'Document validation failed. Please try again.'
    };
  }
}

// Helper to convert File to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
