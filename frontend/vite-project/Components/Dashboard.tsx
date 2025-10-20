import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import QrGenerator from './QrGenarator';
import ReportUpload from './ReportUpload';

interface DashboardProps {
  token: string;
  user: any;
  onLogout: () => void;
}

function Dashboard({ token, user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'generate' | 'reports'>('upload');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/reports/my-reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setReports(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/reports/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Report deleted successfully');
      fetchReports();
    } catch (error: any) {
      toast.error('Failed to delete report');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QR Report Manager</h1>
              <p className="text-gray-600">Welcome back, {user.username}!</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload Report
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'generate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Generate QR Code
            </button>
            <button
              onClick={() => {
                setActiveTab('reports');
                fetchReports();
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Reports ({reports.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'upload' && (
            <ReportUpload token={token} onUploadSuccess={fetchReports} />
          )}
          
          {activeTab === 'generate' && (
            <QrGenerator token={token} />
          )}
          
          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">My Reports</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading reports...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reports uploaded yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => (
                      <div key={report._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-medium text-gray-900 mb-2">{report.reportName}</h3>
                        <p className="text-sm text-gray-600 mb-2">ID: {report.reportId}</p>
                        <p className="text-sm text-gray-500 mb-4">
                          Uploaded: {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteReport(report.reportId)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;