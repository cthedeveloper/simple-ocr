import { useState, useEffect } from "react";
import { Switch, Select, Slider } from "antd";

const { Option } = Select;

const Settings = () => {
  const [preprocessing, setPreprocessing] = useState({
    grayscale: true,
    sharpen: false,
    contrast: false,
  });

  const [outputFormat, setOutputFormat] = useState<"plain" | "lines" | "json">(
    "lines"
  );
  const [autoSave, setAutoSave] = useState(true);
  const [autoDetectLang, setAutoDetectLang] = useState(false);
  const [defaultExportFormat, setDefaultExportFormat] = useState<
    "pdf" | "excel" | "word"
  >("pdf");
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    const saved = localStorage.getItem("ocrSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPreprocessing(parsed.preprocessing || preprocessing);
      setOutputFormat(parsed.outputFormat || "lines");
      setAutoSave(parsed.autoSave ?? true);
      setAutoDetectLang(parsed.autoDetectLang ?? false);
      setDefaultExportFormat(parsed.defaultExportFormat || "pdf");
      setShowProgressBar(parsed.showProgressBar ?? true);
      setFontSize(parsed.fontSize || 14);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ocrSettings",
      JSON.stringify({
        preprocessing,
        outputFormat,
        autoSave,
        autoDetectLang,
        defaultExportFormat,
        showProgressBar,
        fontSize,
      })
    );
  }, [
    preprocessing,
    outputFormat,
    autoSave,
    autoDetectLang,
    defaultExportFormat,
    showProgressBar,
    fontSize,
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-8">
      <h2 className="text-3xl text-[#004D40] dark:text-[#80CBC4] font-semibold mb-6">
        Settings
      </h2>

      {/* Two Cards per Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preprocessing Settings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
          <h3 className="text-xl text-gray-700 dark:text-gray-200 font-medium mb-2">
            Image Preprocessing
          </h3>
          <div className="space-y-2">
            {["grayscale", "sharpen", "contrast"].map((option) => (
              <div key={option} className="flex items-center justify-between">
                <span className="capitalize text-gray-600 dark:text-gray-300">
                  {option}
                </span>
                <Switch
                  checked={preprocessing[option as keyof typeof preprocessing]}
                  onChange={(checked) =>
                    setPreprocessing({ ...preprocessing, [option]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Output Format Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
          <h3 className="text-xl text-gray-700 dark:text-gray-200 font-medium mb-2">
            Output Format
          </h3>
          <Select
            value={outputFormat}
            onChange={setOutputFormat}
            className="w-full"
          >
            <Option value="plain">Plain Text</Option>
            <Option value="lines">Line-separated</Option>
            <Option value="json">JSON (with metadata)</Option>
          </Select>
        </div>
      </div>

      {/* Two more cards per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Auto Save Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              Auto Save Results
            </span>
            <Switch checked={autoSave} onChange={setAutoSave} />
          </div>
        </div>

        {/* Auto Detect Language Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              Auto Detect Language
            </span>
            <Switch checked={autoDetectLang} onChange={setAutoDetectLang} />
          </div>
        </div>
      </div>

      {/* Two more cards per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Default Export Format Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
          <h3 className="text-xl text-gray-700 dark:text-gray-200 font-medium mb-2">
            Default Export Format
          </h3>
          <Select
            value={defaultExportFormat}
            onChange={setDefaultExportFormat}
            className="w-full"
          >
            <Option value="pdf">PDF</Option>
            <Option value="excel">Excel</Option>
            <Option value="word">Word</Option>
          </Select>
        </div>

        {/* Show Progress Bar Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              Show OCR Progress Bar
            </span>
            <Switch checked={showProgressBar} onChange={setShowProgressBar} />
          </div>
        </div>
      </div>

      {/* Font Size Slider Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6 transition-transform transform hover:scale-105 hover:shadow-xl">
        <h3 className="text-xl text-gray-700 dark:text-gray-200 font-medium mb-2">
          Text Display Font Size
        </h3>
        <Slider
          min={12}
          max={24}
          step={1}
          value={fontSize}
          onChange={setFontSize}
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Font Size: {fontSize}px
        </span>
      </div>
    </div>
  );
};

export default Settings;
