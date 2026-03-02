import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, AlertCircle, Loader, Clock } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../constant/api";
import { useNavigate } from "react-router-dom";

const verificationSchema = Yup.object({
  verificationCode: Yup.string()
    .required("Verification code is required")
    .length(6, "Verification code must be 6 digits")
    .matches(/^\d+$/, "Verification code must contain only numbers"),
});

const PasswordResetVerifyOtp: React.FC = () => {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(10 * 60); // 10 minutes in seconds
  const [otpExpired, setOtpExpired] = useState(false);

  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  // OTP expiry countdown
  useEffect(() => {
    if (otpExpiry <= 0) {
      setOtpExpired(true);
      return;
    }
    const timer = setTimeout(() => {
      setOtpExpiry((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [otpExpiry]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Color changes as time runs out
  const getTimerColor = () => {
    if (otpExpiry <= 60) return "text-red-600";
    if (otpExpiry <= 3 * 60) return "text-amber-500";
    return "text-green-600";
  };

  const getTimerBg = () => {
    if (otpExpiry <= 60) return "bg-red-50 border-red-200";
    if (otpExpiry <= 3 * 60) return "bg-amber-50 border-amber-200";
    return "bg-green-50 border-green-200";
  };

  const formik = useFormik({
    initialValues: {
      verificationCode: "",
    },
    validationSchema: verificationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);

        const response = await api.post("user/password-reset/verify-otp/", {
          identifier: email,
          otp_code: values.verificationCode,
        });

        console.log("Email verification successful:", response.data);
        setStatus({
          type: "success",
          message:
            "Email verified successfully! You can now access your account.",
        });
        localStorage.setItem("otpToken", values.verificationCode);
        localStorage.setItem("resetToken", response.data.reset_token);

        setTimeout(() => {
          navigate("/change-password");
        }, 2000);
      } catch (error: any) {
        console.error("Email verification failed:", error);

        if (error.response?.data) {
          const errorMessage =
            error.response.data.message ||
            "Invalid verification code. Please try again.";
          setStatus({ type: "error", message: errorMessage });
        } else if (error.request) {
          setStatus({
            type: "error",
            message:
              "Network error. Please check your connection and try again.",
          });
        } else {
          setStatus({
            type: "error",
            message: "An unexpected error occurred. Please try again.",
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    touched,
    isSubmitting,
    status,
  } = formik;

  const handleResendCode = async () => {
    try {
      setResendLoading(true);

      const response = await api.post("user/password-reset/resend-otp", {
        email_address: email,
      });

      console.log("Verification code resent:", response.data);
      formik.setStatus({
        type: "success",
        message: "Verification code has been resent to your email.",
      });

      // Reset OTP expiry and expired state
      setOtpExpiry(10 * 60);
      setOtpExpired(false);
      setResendCooldown(60);
    } catch (error: any) {
      console.error("Failed to resend verification code:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to resend verification code. Please try again.";
      formik.setStatus({ type: "error", message: errorMessage });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 md:px-0 py-4">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <div className="flex justify-center">
            <img className="h-20 w-20" src="/Icon1 .png" alt="Toltim logo" />
          </div>
          <h2 className="mt-3 text-center text-3xl text-gray-900">
            Verify Your Email
          </h2>
          <p className="text-gray-500 text-center mt-1">
            We've sent a verification code to your email
          </p>
          {email && (
            <p className="text-green-600 text-center mt-1 font-medium">
              {email}
            </p>
          )}
        </div>

        {/* Email Verification Info Banner */}
        <div className="w-full bg-blue-50 border border-blue-200 py-4 px-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Mail className="text-blue-600 text-xl" />
            <span className="text-blue-700 text-base font-semibold ml-2">
              Email Verification Required
            </span>
          </div>
          <p className="text-blue-600 text-sm">
            Please check your email inbox and spam folder for the 6-digit
            verification code
          </p>
        </div>

        {/* Countdown Timer */}
        <div
          className={`w-full border rounded-lg py-4 px-4 ${getTimerBg()} transition-colors duration-500`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${getTimerColor()}`} />
              <span className={`text-sm font-semibold ${getTimerColor()}`}>
                {otpExpired ? "Code Expired" : "Code expires in"}
              </span>
            </div>
            <div
              className={`font-mono text-2xl font-bold tabular-nums ${getTimerColor()}`}
            >
              {otpExpired ? "00:00" : formatTime(otpExpiry)}
            </div>
          </div>

          {/* Progress bar */}
          {!otpExpired && (
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-1000 ${
                  otpExpiry <= 60
                    ? "bg-red-500"
                    : otpExpiry <= 3 * 60
                      ? "bg-amber-400"
                      : "bg-green-500"
                }`}
                style={{ width: `${(otpExpiry / (10 * 60)) * 100}%` }}
              />
            </div>
          )}

          {otpExpired && (
            <p className="text-red-600 text-xs mt-2">
              Your code has expired. Please request a new one below.
            </p>
          )}
        </div>

        <div className="mt-8 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Status Messages */}
            {status && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-center ${
                  status.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle className="text-green-600 text-lg mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle className="text-red-600 text-lg mr-2 flex-shrink-0" />
                )}
                <p className="text-sm">{status.message}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  maxLength={6}
                  required
                  value={values.verificationCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={otpExpired}
                  className={`mt-1 block w-full px-3 py-3 border text-center text-2xl font-mono tracking-widest ${
                    errors.verificationCode && touched.verificationCode
                      ? "border-red-300"
                      : otpExpired
                        ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                        : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  placeholder="000000"
                />
                {errors.verificationCode && touched.verificationCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.verificationCode}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting || otpExpired}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition duration-300 ${
                  isSubmitting || otpExpired
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>
            </div>
          </form>

          {/* Resend Code Section */}
          <div className="text-center border-t pt-6">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || resendCooldown > 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition duration-300 ${
                resendLoading || resendCooldown > 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              }`}
            >
              {resendLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Resending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                "Resend Code"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetVerifyOtp;
