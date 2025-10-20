import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function ReportViewer() {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reports/view/${reportId}`);
        setReport(response.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Report not found');
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const handleDownload = () => {
    if (reportId) {
      window.open(`http://localhost:5000/api/reports/download/${reportId}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h1>
          <p className="text-gray-600">The report you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.reportName}</h1>
            <p className="text-gray-600">Report ID: {report.reportId}</p>
            <p className="text-sm text-gray-500">
              Uploaded on: {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Report Document</h2>
              <p className="text-gray-600 mb-4">Click the button below to download and view the PDF report.</p>
            </div>

            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center mx-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Report
            </button>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">How to use this QR Code</h3>
              <p className="text-blue-700">
                This QR code was generated for the report "{report.reportName}". 
                Anyone who scans this QR code will be redirected to this page where they can view and download the report.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportViewer;