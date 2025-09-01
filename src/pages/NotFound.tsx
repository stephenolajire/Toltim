import {
  Home,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-green-400 to-green-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-green-500 to-green-700 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-green-300 to-green-500 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 text-center">
          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-[10rem] md:text-[13rem] lg:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 leading-none select-none">
              404
            </h1>
          </div>

          {/* Error Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <AlertTriangle className="w-5 h-5 mr-3" />
            <span className="font-semibold text-sm md:text-base">
              Oops! Page Not Found
            </span>
          </div>

          {/* Main Message */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Lost in
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              {" "}
              Care?
            </span>
          </h2>

          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed mb-8">
            It seems like the page you're looking for has taken a different path
            to wellness! Don't worry, your healthcare journey continues here
            with us.
          </p>

          {/* Action Buttons */}
          <div className=" bg-opacity-5 backdrop-blur-md rounded-2xl p-8 border mb-5 md:mb-0 border-white border-opacity-10 shadow-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              What would you like to do?
            </h3>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleGoHome}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-lg px-8 py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Home className="w-5 h-5" />
                Go Home
              </button>

              <button
                onClick={handleGoBack}
                className="flex items-center justify-center gap-3 bg-white bg-opacity-10 border border-white border-opacity-30 text-green-600 font-semibold text-lg px-8 py-4 rounded-lg hover:bg-opacity-20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            {/* <div className="pt-6 border-t border-white border-opacity-20">
              <p className="text-gray-300 text-sm mb-4">
                Or explore these popular sections:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm"
                >
                  <Heart className="w-4 h-4" />
                  Patient Profile
                </button>
                <button
                  onClick={() => navigate("/appointments")}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Appointments
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium px-4 py-2 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 text-sm"
                >
                  <Activity className="w-4 h-4" />
                  Dashboard
                </button>
              </div>
            </div> */}

            {/* Health Tip */}
            <div className="mt-8 pt-6 border-t border-white border-opacity-20">
              <p className="text-gray-300 text-sm leading-relaxed">
                💡 <strong>Health Tip:</strong> While you're here, remember to
                stay hydrated and take regular breaks if you've been browsing
                for a while. Your wellbeing is our priority!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
