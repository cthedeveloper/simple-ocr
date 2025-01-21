import React from "react";
import {
  validateTextWithNLP,
  detectLanguage,
  checkRedundancy,
  calculateReadability,
  suggestImprovements,
} from "../utils/nlpvalidation";

// Define the prop types for the ExcelTemplate component
interface ExcelTemplateProps {
  data: any; // Accept any type to handle edge cases
  title: string;
}

const ExcelTemplate: React.FC<ExcelTemplateProps> = ({ data, title }) => {
  // Ensure data is a 2D array
  const processedData = Array.isArray(data)
    ? data.map((row) => (Array.isArray(row) ? row : [row]))
    : [["Invalid data format"]];

  // Flatten the data for NLP analysis
  const flattenedData = processedData.flat();

  // NLP Validation
  const isValidText = validateTextWithNLP(flattenedData);
  const language = detectLanguage(flattenedData);
  const isRedundant = checkRedundancy(flattenedData);
  const readabilityScore = calculateReadability(flattenedData);
  const improvementSuggestions = suggestImprovements(flattenedData);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h4 className="font-semibold mb-4">{title}</h4>
      <div className="overflow-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {processedData[0]?.map((_, colIndex) => (
                <th
                  key={colIndex}
                  className="border border-gray-300 px-2 py-1 bg-[#E0F7FA] text-[#00796B] font-semibold"
                >
                  Column {colIndex + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 px-2 py-1 text-sm text-gray-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

// Export the components with specific titles
export const ExcelTemplate1: React.FC<{ data: any }> = ({ data }) => (
  <ExcelTemplate data={data} title="Excel Template 1" />
);

export const ExcelTemplate2: React.FC<{ data: any }> = ({ data }) => (
  <ExcelTemplate data={data} title="Excel Template 2" />
);
