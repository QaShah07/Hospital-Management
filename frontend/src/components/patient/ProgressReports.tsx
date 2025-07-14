import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { format } from 'date-fns';
import { appointmentsAPI } from '../../services/api';
import { PatientReport } from '../../types';
import { FileText, Upload, Download, Eye, Calendar, User } from 'lucide-react';

interface ProgressReportsProps {
  patientId: string;
}

export const ProgressReports: React.FC<ProgressReportsProps> = ({ patientId }) => {
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    description: '',
    fileType: 'text' as 'pdf' | 'image' | 'text',
    content: ''
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await appointmentsAPI.getPatientReports(patientId);
        setReports(data);
      } catch (err) {
        setError('Failed to load reports');
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [patientId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reportData = {
        patient: patientId,
        doctor: 1, // This should be the assigned doctor ID
        description: uploadData.description,
        file_type: uploadData.fileType,
        file_content: uploadData.fileType === 'text' ? uploadData.content : null
      };
      
      await appointmentsAPI.createPatientReport(reportData);
      
      // Refresh reports list
      const updatedReports = await appointmentsAPI.getPatientReports(patientId);
      setReports(updatedReports);
      
      setShowUploadForm(false);
      setUploadData({ description: '', fileType: 'text', content: '' });
    } catch (err) {
      console.error('Error uploading report:', err);
      alert('Failed to upload report');
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-600" />;
      case 'image':
        return <Eye className="h-6 w-6 text-blue-600" />;
      case 'text':
        return <FileText className="h-6 w-6 text-green-600" />;
      default:
        return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Progress Reports</h2>
        <Button onClick={() => setShowUploadForm(!showUploadForm)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Report
        </Button>
      </div>

      {showUploadForm && (
        <Card>
          <form onSubmit={handleUpload} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Progress Report
            </h3>
            
            <Input
              label="Description"
              value={uploadData.description}
              onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your progress report..."
              required
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Report Type
              </label>
              <select
                value={uploadData.fileType}
                onChange={(e) => setUploadData(prev => ({ ...prev, fileType: e.target.value as any }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="text">Text Report</option>
                <option value="pdf">PDF Document</option>
                <option value="image">Image</option>
              </select>
            </div>

            {uploadData.fileType === 'text' && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Report Content
                </label>
                <textarea
                  value={uploadData.content}
                  onChange={(e) => setUploadData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your progress report here..."
                  required
                />
              </div>
            )}

            <div className="flex space-x-3">
              <Button type="submit">Upload Report</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUploadForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {reports.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
          <p className="text-gray-500 mb-6">Upload your first progress report to share with your doctor</p>
          <Button onClick={() => setShowUploadForm(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Report
          </Button>
        </Card>
      ) : (
      <div className="space-y-4">
        {reports.map(report => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getFileIcon(report.file_type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{report.description}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(report.upload_date), 'PPP')}</span>
                  </div>
                </div>

                {report.file_type === 'text' && report.file_content && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-gray-700">{report.file_content}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
};