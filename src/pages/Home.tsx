import { useState, useEffect } from "react";
import { createWorker } from "tesseract.js";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { notification, Dropdown, Menu, Switch, Spin } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileWordOutlined,
} from "@ant-design/icons";

import { ExcelTemplate1, ExcelTemplate2 } from "../components/ExcelTemplate";
import { PDFTemplate1, PDFTemplate2 } from "../components/PDFTemplate";
import { WordTemplate1, WordTemplate2 } from "../components/WordTemplate";

const Home = () => {
  const [image, setImage] = useState<string | null>(null);
  const [textLines, setTextLines] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [language] = useState<string>("eng");
  const [worker, setWorker] = useState<any>(null);
  const [workerBusy, setWorkerBusy] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const isDark = theme === "dark";

  useEffect(() => {
    const initializeWorker = async () => {
      try {
        const newWorker = await createWorker();
        await newWorker.load();
        await newWorker.reinitialize(language);
        await newWorker.reinitialize(language);
        setWorker(newWorker);
      } catch (error) {
        notification.error({
          message: "OCR Error",
          description: "Failed to initialize OCR worker.",
        });
      }
    };

    initializeWorker();
    return () => worker?.terminate?.();
  }, [language, worker]);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImage(file);
  };

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) handleImage(event.target.files[0]);
  };

  const handleImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
    setLoading(true);

    const img = new Image();
    img.src = url;
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob || !worker || workerBusy) return;

        try {
          setWorkerBusy(true);
          const { data } = await worker.recognize(blob);
          const cleanText = data.text
            .split("\n")
            .filter((line: string) => line.trim());
          setTextLines(cleanText);
        } catch {
          notification.error({
            message: "OCR Error",
            description: "Image processing failed.",
          });
        } finally {
          setLoading(false);
          setWorkerBusy(false);
          setProgress(0);
        }
      });
    };
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(textLines.map((line) => ({ line })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Text");
    XLSX.writeFile(wb, "text_data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    textLines.forEach((line, i) => doc.text(line, 10, 10 + i * 10));
    doc.save("text_data.pdf");
  };

  const exportToWord = () => {
    const blob = new Blob([textLines.join("\n")], {
      type: "application/msword",
    });
    saveAs(blob, "text_data.doc");
  };

  const exportMenu = (
    <Menu
      style={{
        border: "2px solid #22c55e",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
      items={[
        {
          key: "excel",
          icon: <FileExcelOutlined className="text-green-600" />,
          label: "Export to Excel",
          onClick: exportToExcel,
        },
        {
          key: "pdf",
          icon: <FilePdfOutlined className="text-red-500" />,
          label: "Export to PDF",
          onClick: exportToPDF,
        },
        {
          key: "word",
          icon: <FileWordOutlined className="text-blue-500" />,
          label: "Export to Word",
          onClick: exportToWord,
        },
      ]}
    />
  );

  const handleTemplateSelect = (template: string, type: string) => {
    setSelectedTemplate(template);
    setSelectedType(type);
  };

  const themeClass = isDark ? "bg-gray-900 text-white" : "bg-white text-black";

  return (
    <div className={`${themeClass} min-h-screen transition-colors`}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-green-600">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span>🌙</span>
          <Switch
            checked={isDark}
            onChange={(v) => setTheme(v ? "dark" : "light")}
          />
          <span>☀️</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 p-6">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`w-full lg:w-1/2 p-6 rounded-lg border-2 border-dashed ${
            isDark
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-gray-50"
          } text-center`}
        >
          <label htmlFor="image" className="cursor-pointer">
            <div className="text-xl font-semibold mb-2">
              Upload or Drag Image
            </div>
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImageSelection}
            />
            <p className="text-sm text-gray-500">
              PNG, JPG — Click or Drag to upload
            </p>
          </label>

          {loading && (
            <div className="mt-4">
              <Spin size="large" tip={`Processing... ${progress}%`} />
            </div>
          )}
          {!loading && image && (
            <img
              src={image}
              alt="Preview"
              className="mt-4 w-full rounded-lg shadow-md object-contain"
            />
          )}
        </div>

        <div className="w-full lg:w-1/2 p-6 rounded-lg border bg-white dark:bg-gray-800 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Extracted Text
          </h2>
          <div className="max-h-64 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-inner">
            {textLines.length > 0 ? (
              textLines.map((line, i) => (
                <p
                  key={i}
                  className="text-sm text-gray-800 dark:text-gray-200 mb-1"
                >
                  {line}
                </p>
              ))
            ) : (
              <p className="italic text-gray-500">No text extracted yet.</p>
            )}
          </div>

          <div className="my-4">
            <Dropdown overlay={exportMenu}>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow inline-flex items-center gap-2 transition">
                <DownloadOutlined /> Export Options
              </button>
            </Dropdown>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Select Template
            </label>
            <select
              onChange={(e) => {
                const [type, template] = e.target.value.split("-");
                handleTemplateSelect(template, type);
              }}
              className="w-full p-2 rounded border-2 border-green-500 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Choose Template</option>
              <option value="excel-template1">Excel Template 1</option>
              <option value="excel-template2">Excel Template 2</option>
              <option value="pdf-pdfTemplate1">PDF Template 1</option>
              <option value="pdf-pdfTemplate2">PDF Template 2</option>
              <option value="word-wordTemplate1">Word Template 1</option>
              <option value="word-wordTemplate2">Word Template 2</option>
            </select>
          </div>

          <AnimatePresence>
            {selectedTemplate && selectedType && (
              <motion.div
                key={selectedTemplate}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-xl font-semibold mb-3">Template Preview</h3>
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
                    <PDFTemplate1 text={textLines} />
                  )}
                {selectedType === "pdf" &&
                  selectedTemplate === "pdfTemplate2" && (
                    <PDFTemplate2 text={textLines} />
                  )}
                {selectedType === "word" &&
                  selectedTemplate === "wordTemplate1" && (
                    <WordTemplate1 data={textLines} />
                  )}
                {selectedType === "word" &&
                  selectedTemplate === "wordTemplate2" && (
                    <WordTemplate2 data={textLines} />
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Home;
