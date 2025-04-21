import {
  validateTextWithNLP,
  detectLanguage,
  checkRedundancy,
  calculateReadability,
  suggestImprovements,
} from "../utils/nlpvalidation";

// Define the prop types for the PDFTemplate component
interface PDFTemplateProps {
  text: string | string[]; // Accept both string or array of strings
  title: string;
}

const PDFTemplate: React.FC<PDFTemplateProps> = ({ text = "", title }) => {
  // Default to empty string if text is undefined
  // Debugging: log the type of text to see what we are getting
  console.log("Received text:", text);
  console.log("Text type:", typeof text);
  console.log("Is array:", Array.isArray(text));

  // Ensure the input text is either a string or an array of strings
  const isValidInput = typeof text === "string" || Array.isArray(text);

  if (!isValidInput) {
    return (
      <div className="p-4 bg-white rounded shadow-md text-red-600">
        <h4 className="font-semibold">{title}</h4>
        <p className="mt-4">
          Invalid input. The text must be a string or an array of strings.
        </p>
      </div>
    );
  }

  // Convert the text to an array of lines if it's a string
  const lines = Array.isArray(text) ? text : text.split("\n");

  // Validate text using NLP functions
  const isValidText = validateTextWithNLP(lines);

  if (!isValidText) {
    return (
      <div className="p-4 bg-white rounded shadow-md text-red-600">
        <h4 className="font-semibold">{title}</h4>
        <p className="mt-4">
          The text is not valid according to NLP validation.
        </p>
      </div>
    );
  }
  const language = detectLanguage(lines);
  const isRedundant = checkRedundancy(lines);
  const readabilityScore = calculateReadability(lines);
  const improvementSuggestions = suggestImprovements(lines);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h4 className="font-semibold mb-4">{title}</h4>
      <div className="text-sm text-gray-700 leading-relaxed">
        {/* Render the lines */}
        {lines.map((line) => (
          <p key={line} className="mt-2">
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
            {improvementSuggestions.map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Export the components with specific titles
export const PDFTemplate1: React.FC<{ text: string | string[] }> = ({
  text,
}) => <PDFTemplate text={text || ""} title="PDF Template 1" />;

export const PDFTemplate2: React.FC<{ text: string | string[] }> = ({
  text,
}) => <PDFTemplate text={text || ""} title="PDF Template 2" />;
