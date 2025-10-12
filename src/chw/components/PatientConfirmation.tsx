import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import api from "../../constant/api";
import type { BookingData } from "../../types/bookingdata";
import { toast } from "react-toastify";

interface PatientConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  dateError?: string;
  isLoading?: boolean;
  bookingData?: BookingData | null;
}

const PatientConfirmation: React.FC<PatientConfirmationProps> = ({
  isOpen,
  onClose,
  onSubmit,
  dateError = "",
  isLoading = false,
  bookingData,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [sessionExpired, setSessionExpired] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Track if we've already processed this session
  const hasProcessedSession = useRef(false);
  const sessionId = useRef<string | null>(null);

  const id = bookingData?.id;
  const currentDate = new Date().toISOString().split("T")[0];
  const date = bookingData?.service_dates;

  // Generate unique session identifier
  const currentSessionId = `${id}-${currentDate}-${isOpen}`;

  // Check session validity and send OTP - ONLY ONCE per session
  useEffect(() => {
    if (!isOpen || !date || !id) {
      // Reset when modal closes
      if (!isOpen) {
        hasProcessedSession.current = false;
        sessionId.current = null;
      }
      return;
    }

    // Check if we've already processed this exact session
    if (hasProcessedSession.current && sessionId.current === currentSessionId) {
      return;
    }

    // Mark this session as processed
    hasProcessedSession.current = true;
    sessionId.current = currentSessionId;

    const currentDateExists = date.includes(currentDate);

    // Better localStorage handling
    if (currentDateExists) {
      localStorage.setItem("service_date", currentDate);
    } else {
      // Don't store invalid dates - remove any existing service_date
      localStorage.removeItem("service_date");
    }

    if (!currentDateExists) {
      setSessionExpired(true);
      console.log(
        `Current date ${currentDate} is not in scheduled service dates:`,
        date
      );

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setSessionExpired(false);

      // Send OTP when valid session opens
      const sendOtp = async () => {
        try {
          console.log("Sending OTP for service_date:", currentDate);
          console.log("Available service dates:", date);

          const response = await api.post(
            `services/nurse-procedure-bookings/${id}/generate-verification-code/${currentDate}/`
          );

          console.log("OTP Response:", response);
          toast.success(
            "Session OTP has been sent to the patient successfully"
          );
        } catch (error: any) {
          console.error("Error sending OTP:", error);

          if (error.response) {
            if (error.response.status === 429) {
              toast.error(
                "Too many requests. Please try again later in 10mins."
              );
            } else if (error.response.status === 400) {
              // Handle case where date might not be valid for this booking
              toast.error(
                "Invalid service date. Please check the scheduled dates."
              );
            } else {
              const errorMessage =
                error.response.data.errors ||
                error.response.data.detail ||
                error.response.data.message ||
                "Failed to send OTP. Please try again.";
              toast.error(errorMessage);
            }
          } else {
            toast.error("Network error. Please check your connection.");
          }
        }
      };

      sendOtp();
    }
  }, [isOpen, date, id, currentDate, onClose, currentSessionId]);

  // Reset OTP when modal opens - but only for UI, not for API calls
  useEffect(() => {
    if (isOpen && !sessionExpired) {
      setOtp(["", "", "", "", "", ""]);
      // Focus first input when modal opens
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen, sessionExpired]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle paste
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Only process if it's exactly 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
      onSubmit(otpString);
    }
  };

  const handleClose = () => {
    setOtp(["", "", "", "", "", ""]);
    setSessionExpired(false);
    // Reset the session tracking when manually closing
    hasProcessedSession.current = false;
    sessionId.current = null;
    onClose();
  };

  // Manual resend OTP function
  const handleResendOtp = async () => {
    if (!id) {
      toast.error("Cannot resend OTP at this time");
      return;
    }

    if (bookingData.draft_sessions !== bookingData.total_sessions) {
      try {
        const response = await api.post(
          `services/nurse-procedure-bookings/${id}/generate-verification-code/${currentDate}/`
        );

        console.log("Resend OTP Response:", response);
        toast.success("OTP has been resent successfully");

        // Clear current OTP
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } catch (error: any) {
        console.error("Error resending OTP:", error);

        if (error.response?.status === 429) {
          toast.error("Too many requests. Please try again later in 10mins.");
        } else {
          toast.error("Failed to resend OTP. Please try again.");
        }
      }
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  if (!isOpen) return null;

  // Show session expired message
  if (sessionExpired) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={handleClose}
            className="text-red-500 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="w-12 h-12 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Session Expired
              </h3>
              <p className="text-red-500 mb-4">
                Invalid session or session has expired or session has not
                started
              </p>
            </div>

            {date && date.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Available Scheduled Dates:
                </h4>
                {date.map((dateString, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {new Date(dateString).toLocaleDateString()}
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm mb-3 text-gray-500">
              Do you have un recorded session ? pls click the button
            </p>

            <button 
            onClick={()=> setSessionExpired(false)}
             className="w-auto py-2 px-8 text-lg bg-green-500 rounded-2xl text-white ">
              click
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Enter Confirmation Code
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Enter the 6-digit code sent to verify the session
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Error Message */}
          {dateError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {dateError}
              </div>
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Confirmation Code
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="0"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {/* Resend Code */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-green-600 hover:text-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Resend Code
              </button>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={!isComplete || isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientConfirmation;
