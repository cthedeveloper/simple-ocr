import nlp from "compromise";
import { syllable } from "syllable";

// Filters out non-English characters and returns cleaned text
export const cleanText = (text) => {
  if (typeof text !== "string" && !Array.isArray(text)) {
    console.error("Invalid input: Expected a string or an array of strings.");
    return "";
  }

  const rawText = Array.isArray(text) ? text.join(" ") : text;

  // Clean up unwanted characters and extra spaces
  return rawText.replace(/[^a-zA-Z\s.,!?']/g, "").trim();
};

// Checks if the text is meaningful using NLP
export const validateTextWithNLP = (text) => {
  const cleanedText = cleanText(text);
  if (!cleanedText) return false;

  const doc = nlp(cleanedText);

  // Check if the text has sentences and verbs
  const hasSentences = doc.sentences().length > 0;
  const hasVerbs = doc.verbs().length > 0;
  const isTooShort = cleanedText.split(" ").length < 5;

  console.log({ hasSentences, hasVerbs, isTooShort });
  return hasSentences && hasVerbs && !isTooShort;
};

// Detects the language of the text (basic English check)
export const detectLanguage = (text) => {
  const cleanedText = cleanText(text);
  if (!cleanedText) return "Unknown";

  const words = cleanedText.split(/\s+/);

  // Count nouns as a simple check for English text
  const englishWords = words.filter((word) => nlp(word).has("#Noun"));
  const englishRatio =
    words.length > 0 ? englishWords.length / words.length : 0;

  console.log({ words, englishWords, englishRatio });
  return englishRatio > 0.7 ? "English" : "Non-English";
};

// Checks for redundancy in the text
export const checkRedundancy = (text) => {
  const cleanedText = cleanText(text);
  if (!cleanedText) return false;

  const sentences = nlp(cleanedText).sentences().out("array");
  const uniqueSentences = new Set(sentences);

  console.log({ sentences, uniqueSentences });
  return uniqueSentences.size !== sentences.length;
};

// Calculates the Flesch–Kincaid readability score
export const calculateReadability = (text) => {
  const cleanedText = cleanText(text);

  if (cleanedText.split(" ").length < 5) {
    return "Text is too short to calculate readability.";
  }

  // Split into sentences and words
  const sentences = cleanedText.split(/[.!?]/).filter(Boolean);
  const words = cleanedText.split(/\s+/).filter(Boolean);

  let syllableCount = 0;

  // Count syllables for each word
  words.forEach((word) => {
    syllableCount += syllable(word); // Use syllable to count syllables
  });

  const avgWordsPerSentence =
    sentences.length > 0 ? words.length / sentences.length : 1;
  const avgSyllablesPerWord =
    words.length > 0 ? syllableCount / words.length : 1;

  // Calculate Flesch–Kincaid readability score
  return 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
};

// Suggest improvements to the text
export const suggestImprovements = (text) => {
  const readabilityScore = calculateReadability(text);
  const improvements = [];

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

  console.log({ readabilityScore, improvements });
  return improvements;
};
