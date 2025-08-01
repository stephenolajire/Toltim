import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Mail,
  CheckCircle,
  Shield,
  User,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type FlowStep = "otp" | "otp-success" | "kyc" | "kyc-success";

interface FormErrors {
  otp?: string;
  nin?: string;
}

const EmailVerificationFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>("otp");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [nin, setNin] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();

  // Timer for resend OTP
  useEffect(() => {
    if (currentStep === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, currentStep]);

  // Auto-navigation intervals
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | null = null;

    if (currentStep === "otp-success") {
      interval = setTimeout(() => {
        setCurrentStep("kyc");
      }, 2500);
    } else if (currentStep === "kyc-success") {
      interval = setTimeout(() => {
        // Navigate to dashboard or next step
        console.log("Navigating to dashboard...");
        navigate("/patient");
      }, 3000);
    }

    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [currentStep]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && !isVerifying) {
      handleOtpSubmit(newOtp);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (otpValues = otp) => {
    const otpString = otpValues.join("");

    if (otpString.length !== 6) {
      setErrors({ otp: "Please enter all 6 digits" });
      return;
    }

    setIsVerifying(true);
    setErrors({});

    // Simulate API call
    setTimeout(() => {
      console.log("OTP Verified:", otpString);
      setIsVerifying(false);
      setCurrentStep("otp-success");
    }, 1500);
  };

  const handleResendOtp = () => {
    setTimeLeft(30);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setErrors({});
    console.log("Resending OTP...");
  };

  const validateNin = () => {
    const newErrors: FormErrors = {};

    if (!nin.trim()) {
      newErrors.nin = "NIN is required";
    } else if (nin.length !== 11) {
      newErrors.nin = "NIN must be exactly 11 digits";
    } else if (!/^\d+$/.test(nin)) {
      newErrors.nin = "NIN must contain only numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKycSubmit = async () => {
    if (!validateNin()) return;

    setIsSubmittingKyc(true);
    setErrors({});

    // Simulate API call
    setTimeout(() => {
      console.log("KYC Submitted:", { nin });
      setIsSubmittingKyc(false);
      setCurrentStep("kyc-success");
    }, 2000);
  };

  const renderOtpStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-2 sm:px-4 py-8">
      <div className="max-w-md w-full mx-2">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verify Your Email
            </h2>
            <p className="text-gray-600 mt-2">
              We've sent a 6-digit code to your email address
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-center space-x-2 sm:space-x-3 mb-4 px-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el:any) => (otpRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.otp ? "border-red-300" : "border-gray-300"
                  } ${digit ? "border-blue-500 bg-blue-50" : ""}`}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {errors.otp && <p className="text-red-600 text-sm">{errors.otp}</p>}

            {isVerifying && (
              <div className="flex items-center justify-center text-blue-600 text-sm mt-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Verifying...
              </div>
            )}
          </div>

          <div className="text-center">
            {!canResend ? (
              <p className="text-gray-600 text-sm">
                Resend code in{" "}
                <span className="font-semibold text-blue-600">{timeLeft}s</span>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                Resend Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOtpSuccessStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Email Verified!
            </h2>
            <p className="text-gray-600 mt-2">
              Your email has been successfully verified
            </p>
          </div>

          <div className="flex items-center justify-center text-green-600 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Proceeding to KYC verification...
          </div>
        </div>
      </div>
    </div>
  );

  const renderKycStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={() => setCurrentStep("otp")}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              KYC Verification
            </h2>
            <p className="text-gray-600 mt-2">
              Complete your identity verification to continue
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="nin"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                National Identification Number (NIN)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="nin"
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  value={nin}
                  onChange={(e) => setNin(e.target.value.replace(/\D/g, ""))}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.nin ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your 11-digit NIN"
                  disabled={isSubmittingKyc}
                />
              </div>
              {errors.nin && (
                <p className="mt-2 text-red-600 text-sm">{errors.nin}</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Secure & Private
                  </h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Your NIN is encrypted and used only for identity
                    verification. We comply with all data protection
                    regulations.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleKycSubmit}
              disabled={isSubmittingKyc}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center"
            >
              {isSubmittingKyc ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                "Verify Identity"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKycSuccessStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verification Complete!
            </h2>
            <p className="text-gray-600 mt-2">
              Your identity has been successfully verified
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-emerald-50 rounded-lg">
              <Heart className="w-6 h-6 text-emerald-600 mr-3" />
              <div className="text-left">
                <h3 className="font-semibold text-emerald-900">
                  Welcome to Toltimed!
                </h3>
                <p className="text-sm text-emerald-700">
                  You now have full access to our platform
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center text-emerald-600 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              Redirecting to dashboard...
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  switch (currentStep) {
    case "otp":
      return renderOtpStep();
    case "otp-success":
      return renderOtpSuccessStep();
    case "kyc":
      return renderKycStep();
    case "kyc-success":
      return renderKycSuccessStep();
    default:
      return renderOtpStep();
  }
};

export default EmailVerificationFlow;
