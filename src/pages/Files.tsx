import { useState } from "react";
import { Table, Button, Input, Modal, message, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface FileData {
  key: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  settings: string;
}

const FileManagement = () => {
  const [files, setFiles] = useState<FileData[]>([
    // Example files for demonstration purposes
    {
      key: "file1",
      name: "Document1.pdf",
      type: "pdf",
      size: 2048,
      uploadDate: "2025-04-20 12:00:00",
      settings: "Default Setting",
    },
    {
      key: "file2",
      name: "Image1.jpg",
      type: "image",
      size: 1024,
      uploadDate: "2025-04-19 14:30:00",
      settings: "High Quality",
    },
  ]);
  const [editingFile, setEditingFile] = useState<FileData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileSetting, setNewFileSetting] = useState("");

  // Handle file settings edit
  const handleEditFile = (file: FileData) => {
    setEditingFile(file);
    setNewFileName(file.name);
    setNewFileSetting(file.settings);
    setIsModalVisible(true);
  };

  const handleSaveSettings = () => {
    if (editingFile) {
      const updatedFile = {
        ...editingFile,
        name: newFileName,
        settings: newFileSetting,
      };
      setFiles(
        files.map((file) => (file.key === editingFile.key ? updatedFile : file))
      );
      setIsModalVisible(false);
      message.success("File settings updated successfully.");
    }
  };

  // Handle file deletion
  const handleDeleteFile = (fileKey: string) => {
    setFiles(files.filter((file) => file.key !== fileKey));
    message.success("File deleted successfully.");
  };

  // Columns for the Table
  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "File Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Size (KB)",
      dataIndex: "size",
      key: "size",
      render: (size: number) => (size / 1024).toFixed(2), // Convert bytes to KB
    },
    {
      title: "Upload Date",
      dataIndex: "uploadDate",
      key: "uploadDate",
    },
    {
      title: "Settings",
      dataIndex: "settings",
      key: "settings",
      render: (settings: string) => <span>{settings}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: FileData) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditFile(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteFile(record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">File Management</h2>

      {/* Table for Uploaded Files */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Uploaded Files</h3>
        <Table columns={columns} dataSource={files} />
      </div>

      {/* Edit File Modal */}
      <Modal
        title="Edit File Settings"
        visible={isModalVisible}
        onOk={handleSaveSettings}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <label className="block" htmlFor="fileNameInput">
              File Name
            </label>
            <Input
              id="fileNameInput"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
          </div>
          <div>
            <label className="block" htmlFor="fileSettingsInput">
              File Settings
            </label>
            <Input
              id="fileSettingsInput"
              value={newFileSetting}
              onChange={(e) => setNewFileSetting(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FileManagement;
