import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface QrGeneratorProps {
  token: string;
}

function QrGenerator({ token }: QrGeneratorProps) {
  const [reportName, setReportName] = useState('');
  const [reportId, setReportId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [reportUrl, setReportUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!reportName || !reportId) {
      toast.error('Please enter both report name and ID');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/qr/generate',
        { reportId },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setQrCode(response.data.qrCode);
      setReportUrl(response.data.reportUrl);
      toast.success('QR Code generated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    
    // Create a canvas element to convert SVG to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `qr-${reportId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = qrCode;
  };

  return (
    <div className="w-full max-w-md mx-auto border-2 border-gray-400 rounded-xl flex flex-col gap-5 justify-center items-center mt-6 p-6 shadow-md bg-white">
      <p className="text-2xl font-semibold text-blue-800">Generate QR Code</p>

      <div className="w-full space-y-4">
        <input
          type="text"
          placeholder="Enter report name"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          className="border p-2 rounded-md w-full focus:outline-blue-500"
        />

        <input
          type="text"
          placeholder="Enter report ID"
          value={reportId}
          onChange={(e) => setReportId(e.target.value)}
          className="border p-2 rounded-md w-full focus:outline-blue-500"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-all disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate QR Code'}
      </button>

      {qrCode && (
        <div className="mt-4 text-center">
          <div className="mb-4">
            <QRCodeSVG value={reportUrl} size={200} />
          </div>
          <p className="text-sm text-gray-600 mb-2">Report ID: {reportId}</p>
          <p className="text-sm text-gray-600 mb-4">Report Name: {reportName}</p>
          <button
            onClick={downloadQRCode}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
}

export default QrGenerator;
