import React from "react";
import { Heart, Shield, User, ArrowLeft } from "lucide-react";

const KYCVerification: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 md:px-0 py-4">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {/* Back Button */}
        <div className="flex items-center">
          <button className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition duration-300">
            <ArrowLeft className="text-gray-600 text-sm mr-2" />
            Back
          </button>
        </div>

        <div>
          <div className="flex items-center justify-center">
            <Heart className="text-green-600 text-3xl md:text-4xl" />
            <span className="text-xl font-bold ml-2">Toltimed</span>
          </div>

          {/* KYC Icon */}
          <div className="flex justify-center mt-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="text-green-600 text-2xl" />
            </div>
          </div>

          <h2 className="mt-4 text-center text-3xl text-gray-900">
            KYC Verification
          </h2>
          <p className="text-gray-500 text-center mt-1">
            Complete your identity verification to continue
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* KYC Form */}
          <form>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="nin"
                  className="block text-sm font-medium text-gray-700"
                >
                  National Identification Number (NIN)
                </label>
                <div className="mt-1 relative">
                  <input
                    id="nin"
                    name="nin"
                    type="text"
                    maxLength={11}
                    required
                    className="block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your 11-digit NIN"
                  />
                  <User className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                </div>
              </div>
            </div>

            {/* Security Info Banner */}
            <div className="w-full bg-blue-50 border border-blue-200 py-4 px-4 rounded-lg mt-6">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="text-white text-sm" />
                </div>
                <div className="ml-3">
                  <h3 className="text-blue-700 text-sm font-semibold">
                    Secure & Private
                  </h3>
                  <p className="text-blue-600 text-sm mt-1">
                    Your NIN is encrypted and used only for identity
                    verification. We comply with all data protection
                    regulations.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
              >
                Verify Identity
              </button>
            </div>
          </form>

          {/* Additional Information */}
          <div className="bg-gray-50 border border-gray-200 py-4 px-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Why do we need your NIN?
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• To verify your identity and ensure account security</li>
              <li>• To comply with regulatory requirements</li>
              <li>• To protect against fraud and unauthorized access</li>
              <li>• To enable secure healthcare service delivery</li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Need help finding your NIN?
            </p>
            <a
              href="/support"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
