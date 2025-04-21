import { useState } from "react";
import { Tabs, Upload, Button, message } from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  FileAddOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;

type TemplateType = "pdf" | "excel" | "word";

const defaultTemplates: Record<
  TemplateType,
  Array<{ name: string; path: string }>
> = {
  pdf: [
    { name: "Invoice Template", path: "/templates/pdf/invoice.pdf" },
    { name: "Report Template", path: "/templates/pdf/report.pdf" },
    { name: "Meeting Notes", path: "/templates/pdf/meeting-notes.pdf" },
    { name: "Brochure", path: "/templates/pdf/brochure.pdf" },
  ],
  excel: [
    { name: "Budget Template", path: "/templates/excel/budget.xlsx" },
    { name: "Schedule Template", path: "/templates/excel/schedule.xlsx" },
    { name: "Inventory Sheet", path: "/templates/excel/inventory.xlsx" },
    { name: "Sales Tracker", path: "/templates/excel/sales.xlsx" },
  ],
  word: [
    { name: "Resume Template", path: "/templates/word/resume.docx" },
    { name: "Cover Letter", path: "/templates/word/cover_letter.docx" },
    { name: "Meeting Agenda", path: "/templates/word/agenda.docx" },
    { name: "Project Proposal", path: "/templates/word/proposal.docx" },
  ],
};

const Templates = () => {
  const [activeTab, setActiveTab] = useState<TemplateType>("pdf");
  const [templates, setTemplates] = useState(defaultTemplates);

  const handleUpload = (file: File) => {
    const newTemplate = {
      name: file.name,
      path: URL.createObjectURL(file),
    };

    setTemplates((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newTemplate],
    }));

    message.success(`${file.name} uploaded successfully`);
    return false; // prevent auto upload
  };

  const renderCards = (category: TemplateType) =>
    templates[category].map((template, index) => (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition duration-300 w-full"
      >
        <div className="p-4 h-full flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              {template.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              A ready-to-use {category.toUpperCase()} template.
            </p>
          </div>
          <div className="flex justify-between items-center gap-2 mt-auto">
            <a
              href={template.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center text-sm font-medium text-[#004D40] border border-[#004D40] rounded px-3 py-1 hover:bg-[#004D40] hover:text-white transition"
            >
              <EyeOutlined className="mr-1" /> Preview
            </a>
            <a
              href={template.path}
              download
              className="flex-1 inline-flex items-center justify-center text-sm font-medium text-white bg-[#004D40] px-3 py-1 rounded hover:bg-[#00332D] transition"
            >
              <DownloadOutlined className="mr-1" /> Download
            </a>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Template Library
        </h1>

        <Upload beforeUpload={handleUpload} showUploadList={false}>
          <Button
            icon={<FileAddOutlined />}
            className="bg-[#004D40] text-white hover:bg-[#00332D] transition"
          >
            Upload {activeTab.toUpperCase()} Template
          </Button>
        </Upload>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TemplateType)}
        type="card"
        className="mb-6"
      >
        <TabPane tab="PDF Templates" key="pdf" />
        <TabPane tab="Excel Templates" key="excel" />
        <TabPane tab="Word Templates" key="word" />
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderCards(activeTab)}
      </div>
    </div>
  );
};

export default Templates;
