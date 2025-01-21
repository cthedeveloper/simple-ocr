// utils/textValidation.ts
export const validateText = (text: string[]) => {
  // Basic checks for noise or gibberish
  const invalidPatterns = [
    /[^a-zA-Z0-9\s,.!?]/, // Detects non-standard characters
    /\b(?:[a-zA-Z]{1,2})\b/, // Detects words of 1 or 2 letters (may be gibberish)
    /\d{4,}/, // Detects long sequences of digits (likely non-sensible)
    /\b(\w+)\s+\1\b/, // Detects repeated words (e.g., "hello hello")
    /\s{3,}/, // Detects excessive spaces between words
  ];

  // Check each line for anomalies
  for (const line of text) {
    for (const pattern of invalidPatterns) {
      if (pattern.test(line)) {
        return false; // Return false if any line fails the validation
      }
    }
  }

  return true; // Return true if no anomalies detected
};
