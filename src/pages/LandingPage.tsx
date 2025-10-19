import React from "react";
import { CheckCircle, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 hide-scrollbar px-2 sm:px-4 md:px-20 lg:px-50">
      {/* Hero Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Healthcare at Your <span className="text-green-500">Doorstep</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with licensed nurses across Nigerian communities. Get
            professional healthcare services delivered to your home with our
            smart assessment and matching system.
          </p>
          <Link to="/register">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
              Start Your Health Journey
            </button>
          </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How Toltimed Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Health Assessment */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Health Assessment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Complete our smart health assessment form to get personalized
                test recommendations and care guidance.
              </p>
            </div>

            {/* Nurse Matching */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Nurse Matching
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get matched with qualified, licensed nurses in your area based
                on your specific healthcare needs.
              </p>
            </div>

            {/* Home Treatment */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Home Treatment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Receive professional medical care in the comfort of your home
                with scheduled treatment sessions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Why Choose Toltimed */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Why Choose Toltimed?
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 border-2 border-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Licensed Professionals
                    </h3>
                    <p className="text-gray-600">
                      All our nurses are licensed and verified healthcare
                      professionals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 border-2 border-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Nationwide Coverage
                    </h3>
                    <p className="text-gray-600">
                      Serving communities across Nigeria with expanding
                      coverage.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 border-2 border-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      24/7 Availability
                    </h3>
                    <p className="text-gray-600">
                      Healthcare support when you need it, day or night.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="mb-6 opacity-90">
                Join thousands of Nigerians who trust Toltimed for their
                healthcare needs.
              </p>
              <button className="w-full bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                Create Your Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
