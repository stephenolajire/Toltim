import React, { useEffect, useState } from "react";
import { Heart, Mail, ArrowLeft, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Loader } from "lucide-react";
import * as Yup from "yup";
import api from "../constant/api";
import { toast } from "react-toastify";

interface Value {
  email: string;
  phone: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

const ForgotPasswordSchema = (contactMethod: "email" | "phone") =>
  Yup.object({
    email:
      contactMethod === "email"
        ? Yup.string()
            .matches(emailRegex, "Invalid email format")
            .required("Email is required")
        : Yup.string(),
    phone:
      contactMethod === "phone"
        ? Yup.string()
            .matches(phoneRegex, "Invalid phone number format")
            .required("Phone number is required")
        : Yup.string(),
  });

const ForgotPassword: React.FC = () => {
  const [countdown, setCountdown] = useState<number>(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [contactMethod, setContactMethod] = useState<"email" | "phone">(
    "email"
  );

  const navigate = useNavigate();

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev: any) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (countdown === 0 && isRateLimited) {
      setIsRateLimited(false);
    }
  }, [countdown, isRateLimited]);

  const formik = useFormik<Value>({
    initialValues: {
      email: "",
      phone: "",
    },
    validationSchema: ForgotPasswordSchema(contactMethod),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, setStatus, setErrors }) => {
      try {
        setStatus(null);
        const response = await api.post("/user/password-reset/request/", {
          identifier: values.email,
        });

        if (response.data) {
          console.log(response.data);
          if (contactMethod === "email") {
            localStorage.setItem("email", values.email);
          } else {
            localStorage.setItem("phone", values.phone);
          }
          localStorage.setItem("contactMethod", contactMethod);

          setStatus({
            type: "success",
            message: response.data.message,
          });
          toast.success("Password reset request successful");

          setTimeout(() => {
            navigate("/password-reset/verify-otp");
          }, 2000);
        }
      } catch (error: any) {
        console.error("Password reset failed:", error);

        if (error.response?.status === 429) {
          setIsRateLimited(true);
          setCountdown(300);
          setStatus({
            type: "error",
            message: "Too many attempts. Please try again in 5 minutes.",
          });
          return;
        }

        if (error.response?.data) {
          const apiErrors = error.response.data.errors;
          const formErrors: { [key: string]: string } = {};

          if (apiErrors.email_address) {
            formErrors.email = apiErrors.email_address[0];
          }
          if (apiErrors.phone_number) {
            formErrors.phone = apiErrors.phone_number[0];
          }

          setErrors(formErrors);

          setStatus({
            type: "error",
            message: error.response.data.message || "Validation error occurred",
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    errors,
    status,
  } = formik;

  const handleContactMethodChange = (method: "email" | "phone") => {
    setContactMethod(method);
    formik.resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 md:px-0 py-4">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <div className="flex items-center justify-center">
            <Heart className="text-green-600 text-3xl md:text-4xl" />
            <span className="text-xl font-bold ml-2">Toltimed</span>
          </div>
          <h2 className="mt-3 text-center text-3xl text-gray-900">
            Forgot Password?
          </h2>
          <p className="text-gray-500 text-center mt-1">
            Enter your{" "}
            {contactMethod === "email" ? "email address" : "phone number"} and
            we'll send you an OTP to reset your password
          </p>
        </div>

        {/* Contact Method Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => handleContactMethodChange("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
              contactMethod === "email"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            type="button"
            onClick={() => handleContactMethodChange("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
              contactMethod === "phone"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Phone className="w-4 h-4" />
            Phone
          </button>
        </div>

        {/* Password Reset Info Banner */}
        <div className="w-full bg-blue-50 border border-blue-200 py-4 px-4 rounded-lg">
          <div className="flex items-center mb-2">
            {contactMethod === "email" ? (
              <Mail className="text-blue-600 text-xl" />
            ) : (
              <Phone className="text-blue-600 text-xl" />
            )}
            <span className="text-blue-700 text-base font-semibold ml-2">
              Password Reset Request
            </span>
          </div>
          <p className="text-blue-600 text-sm">
            We'll send a six digit OTP to your registered{" "}
            {contactMethod === "email" ? "email address" : "phone number"}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Password Reset Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {status && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    status.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  <p className="text-sm">{status.message}</p>
                </div>
              )}

              {contactMethod === "email" ? (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    required
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.email && touched.email
                        ? "border-red-300"
                        : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                    placeholder="Enter your registered email address"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    required
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.phone && touched.phone
                        ? "border-red-300"
                        : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                    placeholder="Enter your registered phone number"
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting || isRateLimited}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition duration-300 ${
                  isSubmitting || isRateLimited
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Submitting
                  </>
                ) : isRateLimited ? (
                  `Try again in ${formatTimeRemaining(countdown)}`
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>

          {/* Back to Login Section */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500 transition duration-300"
            >
              <ArrowLeft className="text-green-600 text-sm mr-2" />
              Back to Sign In
            </Link>
          </div>

          {/* Additional Help */}
          <div className="text-center border-t pt-6">
            <p className="text-sm text-gray-600 mb-2">
              Need help with your account?
            </p>
            <Link
              to="/contact"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
