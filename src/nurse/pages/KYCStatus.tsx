import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Calendar,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KycStatusData {
  status: 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: string;
  reviewedAt?: string;
  documents: {
    id: string;
    name: string;
    status: 'uploaded' | 'verified' | 'rejected';
    rejectionReason?: string;
  }[];
  rejectionReason?: string;
  estimatedProcessingTime?: string;
}

const KycStatus: React.FC = () => {
  const navigate = useNavigate();
  const [kycData, setKycData] = useState<KycStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchKycStatus = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockData: KycStatusData = {
          status: 'under_review', // Change this to test different states
          submittedAt: '2024-03-15T10:30:00Z',
          estimatedProcessingTime: '2-3 business days',
          documents: [
            {
              id: '1',
              name: 'Government ID',
              status: 'verified'
            },
            {
              id: '2', 
              name: 'Nursing License',
              status: 'verified'
            },
            {
              id: '3',
              name: 'Proof of Address',
              status: 'uploaded'
            }
          ]
        };
        setKycData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchKycStatus();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      case 'submitted': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'rejected': return <XCircle className="w-8 h-8 text-red-600" />;
      case 'under_review': return <Clock className="w-8 h-8 text-blue-600" />;
      case 'submitted': return <AlertCircle className="w-8 h-8 text-yellow-600" />;
      default: return <Clock className="w-8 h-8 text-gray-600" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved': return 'Your KYC verification has been approved! You now have full access to all features.';
      case 'rejected': return 'Your KYC verification was rejected. Please review the feedback and resubmit.';
      case 'under_review': return 'Your documents are currently being reviewed by our team.';
      case 'submitted': return 'Your KYC documents have been submitted successfully.';
      default: return 'Please complete your KYC verification.';
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-lg">Loading KYC status...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!kycData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Status</h2>
            <p className="text-gray-600">Please try again later or contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">KYC Verification Status</h1>
              <p className="text-gray-600">Track your verification progress</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            {getStatusIcon(kycData.status)}
            <div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(kycData.status)}`}>
                {kycData.status.replace('_', ' ').toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {kycData.status === 'approved' ? 'Verification Complete' : 
                 kycData.status === 'rejected' ? 'Verification Failed' : 
                 'Verification in Progress'}
              </h2>
            </div>
          </div>

          <p className="text-gray-700 text-lg mb-6">
            {getStatusMessage(kycData.status)}
          </p>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kycData.submittedAt && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Submitted</p>
                  <p className="text-sm text-gray-600">{formatDate(kycData.submittedAt)}</p>
                </div>
              </div>
            )}

            {kycData.estimatedProcessingTime && kycData.status !== 'approved' && (
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Processing Time</p>
                  <p className="text-sm text-gray-600">{kycData.estimatedProcessingTime}</p>
                </div>
              </div>
            )}

            {kycData.reviewedAt && (
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Reviewed</p>
                  <p className="text-sm text-gray-600">{formatDate(kycData.reviewedAt)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Rejection Reason */}
          {kycData.status === 'rejected' && kycData.rejectionReason && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Rejection Reason</h4>
                  <p className="text-red-700 mt-1">{kycData.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documents Status */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6 text-gray-700" />
            <h3 className="text-xl font-bold text-gray-900">Document Status</h3>
          </div>

          <div className="space-y-4">
            {kycData.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getDocumentStatusIcon(doc.status)}
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    {doc.rejectionReason && (
                      <p className="text-sm text-red-600 mt-1">{doc.rejectionReason}</p>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                  doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {kycData.status === 'rejected' && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/kyc-nurse')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Resubmit Documents
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KycStatus;
