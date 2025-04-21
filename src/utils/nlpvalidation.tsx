import nlp from "compromise";
import { syllable } from "syllable";

// Filters out non-English characters and returns cleaned text
export const cleanText = (text: string | string[]): string => {
  if (typeof text !== "string" && !Array.isArray(text)) {
    console.error("Invalid input: Expected a string or an array of strings.");
    return "";
  }

  const rawText = Array.isArray(text) ? text.join(" ") : text;

  // Clean up unwanted characters and extra spaces
  return rawText.replace(/[^a-zA-Z\s.,!?']/g, "").trim();
};

// Checks if the text is meaningful using NLP
interface ValidateTextWithNLPResult {
  hasSentences: boolean;
  hasVerbs: boolean;
  isTooShort: boolean;
}

export const validateTextWithNLP = (text: string | string[]): boolean => {
  const cleanedText: string = cleanText(text);
  if (!cleanedText) return false;

  const doc = nlp(cleanedText);

  // Check if the text has sentences and verbs
  const hasSentences: boolean = doc.sentences().length > 0;
  const hasVerbs: boolean = doc.verbs().length > 0;
  const isTooShort: boolean = cleanedText.split(" ").length < 5;

  const result: ValidateTextWithNLPResult = {
    hasSentences,
    hasVerbs,
    isTooShort,
  };
  console.log(result);
  return hasSentences && hasVerbs && !isTooShort;
};

// Detects the language of the text (basic English check)
interface DetectLanguageResult {
  words: string[];
  englishWords: string[];
  englishRatio: number;
}

export const detectLanguage = (text: string | string[]): string => {
  const cleanedText: string = cleanText(text);
  if (!cleanedText) return "Unknown";

  const words: string[] = cleanedText.split(/\s+/);

  // Count nouns as a simple check for English text
  const englishWords: string[] = words.filter((word) => nlp(word).has("#Noun"));
  const englishRatio: number =
    words.length > 0 ? englishWords.length / words.length : 0;

  const result: DetectLanguageResult = { words, englishWords, englishRatio };
  console.log(result);
  return englishRatio > 0.7 ? "English" : "Non-English";
};

// Checks for redundancy in the text
interface CheckRedundancyResult {
  sentences: string[];
  uniqueSentences: Set<string>;
}

export const checkRedundancy = (text: string | string[]): boolean => {
  const cleanedText: string = cleanText(text);
  if (!cleanedText) return false;

  const sentences: string[] = nlp(cleanedText).sentences().out("array");
  const uniqueSentences: Set<string> = new Set(sentences);

  const result: CheckRedundancyResult = { sentences, uniqueSentences };
  console.log(result);
  return uniqueSentences.size !== sentences.length;
};

// Calculates the Flesch–Kincaid readability score
export const calculateReadability = (
  text: string | string[]
): number | string => {
  const cleanedText: string = cleanText(text);

  if (cleanedText.split(" ").length < 5) {
    return "Text is too short to calculate readability.";
  }

  // Split into sentences and words
  const sentences: string[] = cleanedText.split(/[.!?]/).filter(Boolean);
  const words: string[] = cleanedText.split(/\s+/).filter(Boolean);

  let syllableCount: number = 0;

  // Count syllables for each word
  words.forEach((word: string) => {
    syllableCount += syllable(word); // Use syllable to count syllables
  });

  const avgWordsPerSentence: number =
    sentences.length > 0 ? words.length / sentences.length : 1;
  const avgSyllablesPerWord: number =
    words.length > 0 ? syllableCount / words.length : 1;

  // Calculate Flesch–Kincaid readability score
  return 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
};

// Suggest improvements to the text
interface SuggestImprovementsResult {
  readabilityScore: number | string;
  improvements: string[];
}

export const suggestImprovements = (text: string | string[]): string[] => {
  const readabilityScore: number | string = calculateReadability(text);
  const improvements: string[] = [];

  // Suggest improvements based on readability
  if (typeof readabilityScore === "number" && readabilityScore < 60) {
    improvements.push("Simplify the sentences to improve readability.");
  }
  if (checkRedundancy(text)) {
    improvements.push("Remove redundant sentences to make the text concise.");
  }
  if (detectLanguage(text) !== "English") {
    improvements.push("Ensure the text is in English for better analysis.");
  }

  const result: SuggestImprovementsResult = { readabilityScore, improvements };
  console.log(result);
  return improvements;
};
