// Document validation using Gemini API

export type DocumentType = 'aadhaar' | 'pan' | 'marksheet' | 'salary_slip';

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  detectedType: string;
  message: string;
}

const DOCUMENT_PROMPTS: Record<DocumentType, string> = {
  aadhaar: `Analyze this image and determine if it is an Indian Aadhaar card.
Look for these characteristics:
- UIDAI logo or "Unique Identification Authority of India" text
- 12-digit Aadhaar number (may be partially masked)
- Photo of the person
- Name, DOB, Gender fields
- Address information
- QR code

Respond in JSON format only:
{
  "isValid": true/false,
  "confidence": 0-100,
  "detectedType": "what document this appears to be",
  "reason": "brief explanation"
}`,

  pan: `Analyze this image and determine if it is an Indian PAN (Permanent Account Number) card.
Look for these characteristics:
- "INCOME TAX DEPARTMENT" or "GOVT. OF INDIA" text
- 10-character alphanumeric PAN number (format: AAAAA0000A)
- Photo of the person
- Name and Father's name
- Date of Birth
- Signature

Respond in JSON format only:
{
  "isValid": true/false,
  "confidence": 0-100,
  "detectedType": "what document this appears to be",
  "reason": "brief explanation"
}`,

  marksheet: `Analyze this image and determine if it is an educational marksheet/grade sheet/transcript.
Look for these characteristics:
- Name of educational institution/university/board
- Student name and roll number
- Subject names with marks/grades
- Total marks or percentage or CGPA
- Examination name (e.g., "Annual Examination", "Semester Exam")
- Official seal or signature

Respond in JSON format only:
{
  "isValid": true/false,
  "confidence": 0-100,
  "detectedType": "what document this appears to be",
  "reason": "brief explanation"
}`,

  salary_slip: `Analyze this image and determine if it is a salary slip/pay slip.
Look for these characteristics:
- Company/employer name or logo
- Employee name and ID
- Pay period (month/year)
- Earnings breakdown (Basic, HRA, allowances)
- Deductions (PF, Tax, etc.)
- Net pay/gross pay amounts

Respond in JSON format only:
{
  "isValid": true/false,
  "confidence": 0-100,
  "detectedType": "what document this appears to be",
  "reason": "brief explanation"
}`
};

export async function validateDocument(
  imageBase64: string,
  expectedType: DocumentType
): Promise<ValidationResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('Gemini API key not configured, skipping validation');
    return {
      isValid: true,
      confidence: 0,
      detectedType: 'unknown',
      message: 'Validation skipped - API key not configured'
    };
  }

  try {
    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
                  mime_type: 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 256,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    
    return {
      isValid: result.isValid === true && result.confidence >= 70,
      confidence: result.confidence || 0,
      detectedType: result.detectedType || 'unknown',
      message: result.isValid 
        ? `Document verified as ${expectedType}` 
        : `This doesn't appear to be a valid ${expectedType}. Detected: ${result.detectedType}. ${result.reason || ''}`
    };
  } catch (error) {
    console.error('Document validation error:', error);
    // On error, allow proceeding but warn
    return {
      isValid: true,
      confidence: 0,
      detectedType: 'unknown',
      message: 'Could not validate document, proceeding with caution'
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
