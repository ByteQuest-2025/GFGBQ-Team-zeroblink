// Document validation using Gemini API

export type DocumentType = 'aadhaar' | 'pan' | 'marksheet' | 'salary_slip';

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  detectedType: string;
  message: string;
}

const DOCUMENT_PROMPTS: Record<DocumentType, string> = {
  aadhaar: `Analyze this image. Is it an Indian Aadhaar card?

Look for: UIDAI logo, 12-digit number, photo, name, DOB, address, QR code.

RESPOND ONLY WITH THIS JSON (no other text):
{"isValid": true, "confidence": 85, "detectedType": "aadhaar card", "reason": "contains UIDAI logo and 12-digit number"}

If NOT an Aadhaar card:
{"isValid": false, "confidence": 90, "detectedType": "what you see", "reason": "why it's not aadhaar"}`,

  pan: `Analyze this image. Is it an Indian PAN card?

Look for: "INCOME TAX DEPARTMENT", 10-character PAN (AAAAA0000A format), photo, name, DOB.

RESPOND ONLY WITH THIS JSON (no other text):
{"isValid": true, "confidence": 85, "detectedType": "pan card", "reason": "contains PAN number format"}

If NOT a PAN card:
{"isValid": false, "confidence": 90, "detectedType": "what you see", "reason": "why it's not pan"}`,

  marksheet: `Analyze this image. Is it an educational marksheet/grade sheet?

Look for: institution name, student name, subjects with marks/grades, total/percentage/CGPA.

RESPOND ONLY WITH THIS JSON (no other text):
{"isValid": true, "confidence": 85, "detectedType": "marksheet", "reason": "contains grades and institution name"}

If NOT a marksheet:
{"isValid": false, "confidence": 90, "detectedType": "what you see", "reason": "why it's not marksheet"}`,

  salary_slip: `Analyze this image. Is it a salary slip/pay slip?

Look for: company name, employee name, pay period, earnings breakdown, deductions, net pay.

RESPOND ONLY WITH THIS JSON (no other text):
{"isValid": true, "confidence": 85, "detectedType": "salary slip", "reason": "contains salary components"}

If NOT a salary slip:
{"isValid": false, "confidence": 90, "detectedType": "what you see", "reason": "why it's not salary slip"}`
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
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Debug: log the response
    console.log('Gemini raw response:', text);
    
    // Clean up the text - remove escaped quotes if the whole thing is a string
    if (text.startsWith('"') && text.includes('\\"')) {
      text = text.slice(1, -1).replace(/\\"/g, '"');
    }
    
    // Parse JSON from response - try multiple patterns
    let result;
    try {
      // Try direct parse first
      result = JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown code block
      let jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        // Try to find JSON object in text
        jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        }
      }
    }
    
    if (!result) {
      console.error('Could not parse JSON from response:', text);
      // If we can't parse, check for keywords in the response
      const lowerText = text.toLowerCase();
      const isLikelyValid = lowerText.includes('yes') || 
                           lowerText.includes('valid') || 
                           lowerText.includes('appears to be') ||
                           lowerText.includes('this is');
      return {
        isValid: isLikelyValid,
        confidence: isLikelyValid ? 70 : 30,
        detectedType: 'unknown',
        message: isLikelyValid ? 'Document appears valid' : 'Could not verify document type'
      };
    }
    
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
