import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ReportUploadProps {
  token: string;
  onUploadSuccess?: () => void;
}

function ReportUpload({ token, onUploadSuccess }: ReportUploadProps) {
  const [formData, setFormData] = useState({
    reportName: '',
    reportId: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast.error('Please select a PDF file');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!formData.reportName || !formData.reportId) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('report', file);
      uploadData.append('reportName', formData.reportName);
      uploadData.append('reportId', formData.reportId);

      const response = await axios.post(
        'http://localhost:5000/api/reports/upload',
        uploadData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Report uploaded successfully!');
      
      // Reset form
      setFormData({ reportName: '', reportId: '' });
      setFile(null);
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border-2 border-gray-400 rounded-xl flex flex-col gap-5 justify-center items-center mt-6 p-6 shadow-md bg-white">
      <p className="text-2xl font-semibold text-blue-800">Upload Report</p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <input
            type="text"
            name="reportName"
            placeholder="Enter report name"
            value={formData.reportName}
            onChange={handleInputChange}
            className="border p-2 rounded-md w-full focus:outline-blue-500"
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="reportId"
            placeholder="Enter report ID"
            value={formData.reportId}
            onChange={handleInputChange}
            className="border p-2 rounded-md w-full focus:outline-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select PDF File
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          {file && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {file.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-all disabled:opacity-50 w-full"
        >
          {loading ? 'Uploading...' : 'Upload Report'}
        </button>
      </form>
    </div>
  );
}

export default ReportUpload;