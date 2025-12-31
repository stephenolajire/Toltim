import React, { useState } from "react";
import { Heart, Clock, Shield, Users, CheckCircle } from "lucide-react";
import { useFormik } from "formik";
import signUpSchema from "./SignupSchema";
import api from "../constant/api";
import { useNavigate } from "react-router-dom";

interface FormValue {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phonenumber: string;
  confirmpassword: string;
  role: string;
}

const SignUp: React.FC = () => {
  const [role, setRole] = useState<"patient" | "nurse" | "chw">("patient");

  const navigate = useNavigate();

  const formik = useFormik<FormValue>({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phonenumber: "",
      password: "",
      confirmpassword: "",
      role: "patient",
    },
    validationSchema: signUpSchema,
    onSubmit: async (values, { setSubmitting, setStatus, setErrors }) => {
      try {
        setStatus(null);

        const response = await api.post("user/signup/", {
          first_name: values.first_name,
          last_name: values.last_name,
          email_address: values.email,
          phone_number: values.phonenumber,
          password: values.password,
          confirm_password: values.confirmpassword,
          role: values.role,
        });

        console.log("Registration successful:", response.data);
        localStorage.setItem("email", values.email);
        navigate("/verify-email");
      } catch (error: any) {
        console.error("Registration failed:", error);

        if (error.response?.data) {
          const apiErrors = error.response.data.errors;
          const formErrors: { [key: string]: string } = {};

          if (apiErrors.phone_number) {
            formErrors.phonenumber = apiErrors.phone_number[0];
          }
          if (apiErrors.email_address) {
            formErrors.email = apiErrors.email_address[0];
          }

          setErrors(formErrors);
          setStatus({
            type: "error",
            message: error.response.data.message || "Validation error occurred",
          });
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
    touched,
    handleChange,
    errors,
    isSubmitting,
    status,
  } = formik;

  const handleUserTypeChange = (type: "patient" | "nurse" | "chw") => {
    setRole(type);
    formik.setFieldValue("role", type);
  };

  const getfirstNameLabel = () => {
    switch (role) {
      case "nurse":
        return "Firstname (as on license)";
      case "chw":
        return "First name (as on certification)";
      default:
        return "First name";
    }
  };

  const getlastNameLabel = () => {
    switch (role) {
      case "nurse":
        return "Lastname (as on license)";
      case "chw":
        return "Last name (as on certification)";
      default:
        return "Last name";
    }
  };

  const getEmailLabel = () => {
    switch (role) {
      case "nurse":
        return "Professional Email Address";
      case "chw":
        return "Professional Email Address";
      default:
        return "Email Address";
    }
  };

  const getRoleContent = () => {
    switch (role) {
      case "nurse":
        return {
          icon: Shield,
          color: "green",
          title: "Join as a Registered Nurse",
          subtitle: "Share your expertise and help families in need",
          benefits: [
            "Flexible work schedule that fits your lifestyle",
            "Competitive compensation for your services",
            "Professional growth and development opportunities",
            "Direct connections with patients who need you",
          ],
          verification: "Verification: 24-48 hours",
        };
      case "chw":
        return {
          icon: Users,
          color: "purple",
          title: "Join as a Community Health Worker",
          subtitle: "Bridge the gap between communities and quality healthcare",
          benefits: [
            "Make a meaningful impact in your community",
            "Steady income stream with flexible hours",
            "Access to training and certification support",
            "Connect with local families who trust you",
          ],
          verification: "Verification: 48-72 hours",
        };
      default:
        return {
          icon: Heart,
          color: "blue",
          title: "Find Quality Healthcare at Home",
          subtitle:
            "Connect with certified nurses and community health workers instantly",
          benefits: [
            "Instant access to qualified healthcare professionals",
            "Book appointments anytime, 24/7 availability",
            "All professionals are verified and licensed",
            "Affordable and convenient home healthcare",
          ],
          verification: "Get instant access after signup",
        };
    }
  };

  const roleContent = getRoleContent();
  const RoleIcon = roleContent.icon;

  const getColorClasses = () => {
    switch (roleContent.color) {
      case "green":
        return {
          bg: "bg-green-500",
          bgHover: "hover:bg-green-600",
          light: "bg-green-500",
          text: "text-green-600",
          border: "border-green-500",
          ring: "#10b981",
        };
      case "purple":
        return {
          bg: "bg-purple-500",
          bgHover: "hover:bg-purple-600",
          light: "bg-purple-500",
          text: "text-purple-600",
          border: "border-purple-500",
          ring: "#a855f7",
        };
      default:
        return {
          bg: "bg-blue-500",
          bgHover: "hover:bg-blue-600",
          light: "bg-blue-500",
          text: "text-blue-600",
          border: "border-blue-500",
          ring: "#3b82f6",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="min-h-screen w-full bg-gray-50 py-12 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start w-full">
          {/* Left Side - Role Information with Animation (Hidden on mobile) */}
          <div
            className={`hidden lg:block w-full ${colors.light} rounded-3xl p-12 sticky top-8 text-white`}
          >
            {/* Animated Rings on Top */}
            <div className="w-full flex items-center justify-center mb-8">
              <div className="relative w-full max-w-80 h-80">
                <svg
                  className="absolute inset-0 w-full h-full animate-spin-slow"
                  viewBox="0 0 320 320"
                >
                  <circle
                    cx="160"
                    cy="160"
                    r="150"
                    fill="none"
                    stroke={colors.ring}
                    strokeWidth="2"
                    strokeDasharray="8,12"
                    opacity="0.3"
                  />
                </svg>
                <svg
                  className="absolute inset-0 w-full h-full animate-spin-reverse"
                  viewBox="0 0 320 320"
                >
                  <circle
                    cx="160"
                    cy="160"
                    r="110"
                    fill="none"
                    stroke={colors.ring}
                    strokeWidth="2"
                    strokeDasharray="6,10"
                    opacity="0.4"
                  />
                </svg>
                <svg
                  className="absolute inset-0 w-full h-full animate-spin-slow"
                  viewBox="0 0 320 320"
                >
                  <circle
                    cx="160"
                    cy="160"
                    r="70"
                    fill="none"
                    stroke={colors.ring}
                    strokeWidth="2"
                    strokeDasharray="4,8"
                    opacity="0.5"
                  />
                </svg>

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <RoleIcon
                      className={`w-full max-w-16 h-16 ${colors.text}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Below */}
            <div className="space-y-6 w-full animate-fade-in">
              <div className="text-center">
                <h2 className="text-h3 text-white mb-3">{roleContent.title}</h2>
                <p className="text-body-base text-white opacity-90">
                  {roleContent.subtitle}
                </p>
              </div>

              <div className="space-y-4 w-full">
                {roleContent.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 w-full">
                    <div className="w-full max-w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle
                        className={`w-full max-w-4 h-4 ${colors.text}`}
                      />
                    </div>
                    <span className="text-body-base text-white">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="w-full bg-white rounded-xl p-4 border-2 border-white">
                <div className="flex items-center justify-center gap-2">
                  <Clock className={`w-full max-w-5 h-5 ${colors.text}`} />
                  <span className="text-body-sm font-semibold text-gray-900">
                    {roleContent.verification}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-white border-opacity-30">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-h4 font-bold text-white">500+</div>
                    <div className="text-body-xs text-white opacity-80">
                      Professionals
                    </div>
                  </div>
                  <div>
                    <div className="text-h4 font-bold text-white">10K+</div>
                    <div className="text-body-xs text-white opacity-80">
                      Patients
                    </div>
                  </div>
                  <div>
                    <div className="text-h4 font-bold text-white">4.9★</div>
                    <div className="text-body-xs text-white opacity-80">
                      Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            {/* Logo & Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <img className="h-30 w-30" src="/Icon1 .png" />
              </div>
              <h1 className="text-h3 text-center text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-600 text-center text-body-base">
                Join thousands using Toltimed for healthcare
              </p>
            </div>

            {/* User Type Toggle */}
            <div className="bg-gray-100 grid grid-cols-3 items-center p-1 rounded-xl w-full mb-8">
              <button
                type="button"
                className={`w-full py-3 flex items-center justify-center text-body-sm font-medium rounded-lg transition-all ${
                  role === "patient"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleUserTypeChange("patient")}
              >
                Patient
              </button>
              <button
                type="button"
                className={`w-full py-3 flex items-center justify-center text-body-sm font-medium rounded-lg transition-all ${
                  role === "nurse"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleUserTypeChange("nurse")}
              >
                Nurse
              </button>
              <button
                type="button"
                className={`w-full py-3 flex items-center justify-center text-body-sm font-medium rounded-lg transition-all ${
                  role === "chw"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "bg-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleUserTypeChange("chw")}
              >
                CHW
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 w-full">
              {/* Status Messages */}
              {status && (
                <div
                  className={`p-3 rounded-lg ${
                    status.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  <p className="text-body-sm">{status.message}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="w-full">
                  <label
                    htmlFor="first_name"
                    className="block text-body-sm font-medium text-gray-700 mb-1"
                  >
                    {getfirstNameLabel()}
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={values.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${
                      errors.first_name && touched.first_name
                        ? "input-error"
                        : ""
                    }`}
                    placeholder="First name"
                  />
                  {errors.first_name && touched.first_name && (
                    <p className="mt-1 text-body-xs text-red-600">
                      {errors.first_name}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label
                    htmlFor="last_name"
                    className="block text-body-sm font-medium text-gray-700 mb-1"
                  >
                    {getlastNameLabel()}
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={values.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${
                      errors.last_name && touched.last_name ? "input-error" : ""
                    }`}
                    placeholder="Last name"
                  />
                  {errors.last_name && touched.last_name && (
                    <p className="mt-1 text-body-xs text-red-600">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-body-sm font-medium text-gray-700 mb-1"
                >
                  {getEmailLabel()}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${
                    errors.email && touched.email ? "input-error" : ""
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-body-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="phonenumber"
                  className="block text-body-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phonenumber"
                  name="phonenumber"
                  type="tel"
                  required
                  value={values.phonenumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${
                    errors.phonenumber && touched.phonenumber
                      ? "input-error"
                      : ""
                  }`}
                  placeholder="+234 ..."
                />
                {errors.phonenumber && touched.phonenumber && (
                  <p className="mt-1 text-body-xs text-red-600">
                    {errors.phonenumber}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="password"
                  className="block text-body-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${
                    errors.password && touched.password ? "input-error" : ""
                  }`}
                  placeholder="Create a strong password"
                />
                {errors.password && touched.password && (
                  <p className="mt-1 text-body-xs text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="confirmpassword"
                  className="block text-body-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  required
                  value={values.confirmpassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${
                    errors.confirmpassword && touched.confirmpassword
                      ? "input-error"
                      : ""
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmpassword && touched.confirmpassword && (
                  <p className="mt-1 text-body-xs text-red-600">
                    {errors.confirmpassword}
                  </p>
                )}
              </div>

              {(role === "nurse" || role === "chw") && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg w-full">
                  <p className="text-yellow-700 text-body-sm">
                    <span className="font-bold">Next Step: </span>After creating
                    your account, you'll complete our professional verification
                    process including document upload and credential review.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-lg font-semibold text-white transition-colors ${colors.bg} ${colors.bgHover} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="text-center w-full mt-6">
              <p className="text-body-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
