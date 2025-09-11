import React from "react";
import { Clock } from "lucide-react";

interface ReviewStatusProps {
  onRestart: () => void;
}

export const ReviewStatus: React.FC<ReviewStatusProps> = ({ onRestart }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Clock className="w-8 h-8 text-blue-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Application Under Review
      </h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Thank you for submitting your verification application. Our team is
        currently reviewing your credentials and documents.
      </p>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Admin review: 1-2 business days</p>
          <p>• Background check: 3-5 business days</p>
          <p>• Final approval & activation: 1 business day</p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="px-6 py-2 text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
      >
        Start New Application
      </button>
    </div>
  );
};