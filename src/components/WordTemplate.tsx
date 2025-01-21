import React from "react";
import {
  validateTextWithNLP,
  detectLanguage,
  checkRedundancy,
  calculateReadability,
  suggestImprovements,
} from "../utils/nlpvalidation";

// Define the prop types for the WordTemplate component
interface WordTemplateProps {
  data: string[];
  title: string;
}

const WordTemplate: React.FC<WordTemplateProps> = ({ data, title }) => {
  // Validate text using NLP functions
  const isValidText = validateTextWithNLP(data);
  const language = detectLanguage(data);
  const isRedundant = checkRedundancy(data);
  const readabilityScore = calculateReadability(data);
  const improvementSuggestions = suggestImprovements(data);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h4 className="font-semibold">{title}</h4>
      <div className="mt-4">
        {isValidText ? (
          <>
            <div>
              {data.map((line, index) => (
                <p key={index} className="text-sm mt-2">
                  {line}
                </p>
              ))}
            </div>
            <div className="mt-4 text-gray-600 text-sm">
              <p>Language Detected: {language}</p>
              <p>Redundancy: {isRedundant ? "Detected" : "None"}</p>
              <p>
                Readability Score:{" "}
                {typeof readabilityScore === "number"
                  ? readabilityScore.toFixed(2)
                  : readabilityScore}
              </p>
            </div>
            {improvementSuggestions.length > 0 && (
              <div className="mt-4">
                <h5 className="font-semibold text-[#00796B]">Suggestions</h5>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  {improvementSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="text-red-600 font-semibold">
            The extracted text seems invalid or contains gibberish. Please
            verify the image.
          </p>
        )}
      </div>
    </div>
  );
};

// Export the components with specific titles
export const WordTemplate1: React.FC<{ data: string[] }> = ({ data }) => (
  <WordTemplate data={data} title="Word Template 1" />
);

export const WordTemplate2: React.FC<{ data: string[] }> = ({ data }) => (
  <WordTemplate data={data} title="Word Template 2" />
);
