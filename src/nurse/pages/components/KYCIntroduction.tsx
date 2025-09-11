// components/KycIntroduction.tsx
import React from "react";
import { CheckCircle, Shield } from "lucide-react";

interface KycIntroductionProps {
  onStart: () => void;
}

export const KycIntroduction: React.FC<KycIntroductionProps> = ({
  onStart,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Nurse Verification Process
        </h1>
        <p className="text-gray-600">
          Join our platform as a verified healthcare professional
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">
              Valid Nursing License Required
            </h3>
            <p className="text-sm text-gray-600">
              RN/LPN/BSN license in good standing
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">
              Professional Experience
            </h3>
            <p className="text-sm text-gray-600">
              Minimum 1 year of clinical experience
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">
              Background Verification
            </h3>
            <p className="text-sm text-gray-600">
              Clean background check and current employment
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
      >
        Start Verification Process
      </button>
    </div>
  );
};