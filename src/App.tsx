import { useState } from "react";
import { createWorker } from "tesseract.js";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Spin } from 'antd'; // Import Ant Design spinner

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [textLines, setTextLines] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const url = URL.createObjectURL(event.target.files[0]);
      setImage(url);
      setLoading(true); // Start loading

      const worker = await createWorker("eng");
      const ret = await worker.recognize(url);
      console.log(ret.data.text);
      setTextLines(ret.data.text.split("\n"));
      await worker.terminate();
      setLoading(false); // End loading
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(textLines.map(line => ({ line })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Text Data");
    XLSX.writeFile(wb, "text_data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    textLines.forEach((line, index) => {
      doc.text(line, 10, 10 + (index * 10));
    });
    doc.save("text_data.pdf");
  };

  const exportToWord = () => {
    const blob = new Blob([textLines.join('\n')], { type: 'application/msword' });
    saveAs(blob, "text_data.doc");
  };

  return (
    <main className="flex min-h-screen items-center justify-start gap-4 p-24 bg-[#E0F7FA] text-[#004D40]">
      <div className="flex-1 flex flex-col items-center gap-4 p-4 bg-white/10 rounded">
        <input
          type="file"
          name="ocr_image"
          id="image"
          onChange={handleImageSelection}
          className="p-2 rounded border border-[#00796B] bg-[#E0F7FA] text-[#004D40]"
        />

        {loading ? (
          <Spin size="large" tip="Processing..." />
        ) : image && (
          <img
            src={image}
            alt="preview image"
            className="w-full h-auto rounded"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col items-start p-4 gap-4 bg-white/10 rounded">
        <h3 className="text-[#004D40]">Text from the Image</h3>
        <div>
          {textLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        
        <div className="flex gap-2 mt-4">
          <button onClick={exportToExcel} className="bg-[#00796B] text-white p-2 rounded hover:bg-[#00695C] transition duration-200">Export to Excel</button>
          <button onClick={exportToPDF} className="bg-[#00796B] text-white p-2 rounded hover:bg-[#00695C] transition duration-200">Export to PDF</button>
          <button onClick={exportToWord} className="bg-[#00796B] text-white p-2 rounded hover:bg-[#00695C] transition duration-200">Export to Word</button>
        </div>
      </div>
    </main>
  );
}
