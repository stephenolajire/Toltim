import React, { useState } from "react";
import { FileText, Upload } from "lucide-react";

const TestAssessment: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleProceedToNurseMatching = () => {
    console.log("Proceeding to nurse matching...");
    // Handle navigation or form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <div className="flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-green-500 mr-2" />
            <span className="text-xl font-medium text-gray-700">Toltimed</span>
          </div> */}

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assessment Complete
          </h1>
          <p className="text-gray-600">
            Based on your symptoms, no additional tests are required
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Ready for Nurse Consultation
          </h2>
          <p className="text-gray-600 mb-6">
            Your symptoms suggest a condition that can be managed with nursing
            care
          </p>

          {/* Assessment Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-green-800 mb-2">
              Assessment Summary
            </h3>
            <p className="text-green-700 text-sm">
              Based on your mild symptoms and short duration, our system
              recommends proceeding directly to nurse consultation without
              additional testing.
            </p>
          </div>

          {/* File Upload Section */}
          <div className="mb-6">
            <p className="text-gray-900 font-medium mb-4">
              Do you have any recent test results to upload?
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FileText className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-lg font-medium text-gray-700 mb-1">
                  Upload test results
                </p>
                <p className="text-sm text-gray-500">
                  PDF, JPG, PNG up to 10MB each
                </p>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                <ul className="text-sm text-gray-700">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="flex items-center">
                      <Upload className="w-4 h-4 mr-2 text-green-500" />
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceedToNurseMatching}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Proceed to Nurse Matching
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestAssessment;
