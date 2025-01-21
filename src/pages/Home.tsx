import React, { useState, useEffect } from "react";
import { createWorker } from "tesseract.js";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Spin, Select, notification } from "antd";
import { ExcelTemplate1, ExcelTemplate2 } from "../components/ExcelTemplate";
import { PDFTemplate1, PDFTemplate2 } from "../components/PDFTemplate";
import { WordTemplate1, WordTemplate2 } from "../components/WordTemplate";

const { Option } = Select;

const Home = () => {
  const [image, setImage] = useState<string | null>(null);
  const [textLines, setTextLines] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("eng");
  const [worker, setWorker] = useState<any>(null);
  const [workerBusy, setWorkerBusy] = useState<boolean>(false);
  const [workerInitialized, setWorkerInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeWorker = async () => {
      try {
        const newWorker = await createWorker();
        await newWorker.load();
        await newWorker.loadLanguage(language);
        await newWorker.initialize(language);

        // Set worker and initialize state
        setWorker(newWorker);
        setWorkerInitialized(true);
      } catch (error) {
        console.error("Error initializing worker:", error);
        notification.error({
          message: "OCR Error",
          description: "Failed to initialize OCR worker. Please try again.",
        });
      }
    };

    initializeWorker();

    return () => {
      if (worker && typeof worker.terminate === "function") {
        worker.terminate();
      }
    };
  }, [language]);

  const handleImageSelection = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setImage(url);
      setLoading(true);

      try {
        if (!workerInitialized || workerBusy) {
          throw new Error("Worker is not initialized or is busy");
        }

        const img = new Image();
        img.src = url;
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(async (blob) => {
              if (!blob) {
                throw new Error("Failed to create blob from canvas");
              }

              // Start OCR processing
              setWorkerBusy(true);
              const { data } = await worker.recognize(blob);
              const cleanText = data.text
                .split("\n")
                .filter((line) => line.trim() !== "");
              setTextLines(cleanText);
            });
          }
        };
      } catch (error) {
        console.error("Image Processing Error:", error);
        notification.error({
          message: "OCR Error",
          description: "Failed to process the image. Please try again.",
        });
      } finally {
        setLoading(false);
        setProgress(0);
        setWorkerBusy(false); // Reset worker status when processing is finished
      }
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(textLines.map((line) => ({ line })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Text Data");
    XLSX.writeFile(wb, "text_data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    textLines.forEach((line, index) => {
      doc.text(line, 10, 10 + index * 10);
    });
    doc.save("text_data.pdf");
  };

  const exportToWord = () => {
    const blob = new Blob([textLines.join("\n")], {
      type: "application/msword",
    });
    saveAs(blob, "text_data.doc");
  };

  const handleTemplateSelect = (template: string, type: string) => {
    setSelectedTemplate(template);
    setSelectedType(type);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center lg:items-start p-6 bg-[#F4F7FA] min-h-screen">
        <div className="flex flex-col w-full lg:w-1/2 items-center gap-6 p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl text-[#00796B] font-semibold">OCR Tool</h2>
          <div className="relative w-full">
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#00796B] rounded-lg cursor-pointer bg-[#E0F7FA] hover:bg-[#B2EBF2] transition duration-200 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="#00796B"
                className="w-10 h-10 mb-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5v-9m0 0l3 3m-3-3l-3 3m9 2.5v3.5a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 013 19V7a2.5 2.5 0 012.5-2.5H9"
                />
              </svg>
              <span className="text-sm text-[#004D40]">
                Click to upload an image
              </span>
            </label>
            <input
              type="file"
              name="ocr_image"
              id="image"
              onChange={handleImageSelection}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <Select
            value={language}
            onChange={setLanguage}
            className="w-full rounded-md border border-[#00796B] bg-[#E0F7FA] focus:outline-none focus:ring-2 focus:ring-[#00796B]"
            placeholder="Select Language"
          >
            <Option value="eng">English</Option>
            <Option value="spa">Spanish</Option>
            <Option value="fra">French</Option>
          </Select>
          {loading ? (
            <Spin size="large" tip={`Processing... ${progress}%`} />
          ) : (
            image && (
              <img
                src={image}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-sm"
              />
            )
          )}
        </div>

        <div className="flex flex-col w-full lg:w-1/2 p-8 bg-white rounded-lg shadow-lg mt-6 lg:mt-0">
          <h3 className="text-[#00796B] text-2xl font-semibold mb-4">
            Extracted Text from the Image
          </h3>
          <div className="text-[#004D40] text-sm mb-6">
            {textLines.length > 0 ? (
              textLines.map((line, index) => (
                <div key={index} className="py-1">
                  {line}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No text extracted yet.</p>
            )}
          </div>

          <div className="flex gap-6 mb-6">
            <button
              onClick={exportToExcel}
              className="bg-[#00796B] text-white py-2 px-4 rounded-lg hover:bg-[#00695C] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#004D40]"
            >
              Export to Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-[#00796B] text-white py-2 px-4 rounded-lg hover:bg-[#00695C] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#004D40]"
            >
              Export to PDF
            </button>
            <button
              onClick={exportToWord}
              className="bg-[#00796B] text-white py-2 px-4 rounded-lg hover:bg-[#00695C] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#004D40]"
            >
              Export to Word
            </button>
          </div>

          <div className="mb-6 w-full">
            <label className="block text-sm font-semibold text-[#00796B]">
              Select Template
            </label>
            <select
              onChange={(e) => {
                const value = e.target.value;
                const [type, template] = value.split("-");
                handleTemplateSelect(template, type);
              }}
              className="mt-2 block w-full border border-[#00796B] text-[#004D40] bg-[#E0F7FA] rounded-md p-2"
            >
              <option value="" disabled selected>
                Choose Template
              </option>
              <option value="excel-template1">Excel Template 1</option>
              <option value="excel-template2">Excel Template 2</option>
              <option value="pdf-pdfTemplate1">PDF Template 1</option>
              <option value="pdf-pdfTemplate2">PDF Template 2</option>
              <option value="word-wordTemplate1">Word Template 1</option>
              <option value="word-wordTemplate2">Word Template 2</option>
            </select>
          </div>

          <div>
            {selectedTemplate && selectedType ? (
              <div>
                <h4 className="text-xl font-semibold text-[#00796B] mb-4">
                  Selected Template Preview
                </h4>
                {selectedType === "excel" &&
                  selectedTemplate === "template1" && (
                    <ExcelTemplate1 data={textLines} />
                  )}
                {selectedType === "excel" &&
                  selectedTemplate === "template2" && (
                    <ExcelTemplate2 data={textLines} />
                  )}
                {selectedType === "pdf" &&
                  selectedTemplate === "pdfTemplate1" && (
                    <PDFTemplate1 data={textLines} />
                  )}
                {selectedType === "pdf" &&
                  selectedTemplate === "pdfTemplate2" && (
                    <PDFTemplate2 data={textLines} />
                  )}
                {selectedType === "word" &&
                  selectedTemplate === "wordTemplate1" && (
                    <WordTemplate1 data={textLines} />
                  )}
                {selectedType === "word" &&
                  selectedTemplate === "wordTemplate2" && (
                    <WordTemplate2 data={textLines} />
                  )}
              </div>
            ) : (
              <p className="text-gray-500">
                Select a template to see a preview.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
