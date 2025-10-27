import React from "react";
import { Heart, Loader, AlertCircle, CheckCircle, Eye, EyeOff, Shield} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import loginSchema from "./LoginSchema";
import api from "../constant/api";
import { toast } from "react-toastify";

interface FormValues {
  email: string;
  password: string;
}

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LocationState)?.from?.pathname;

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        const response = await api.post("user/login/", {
          email_address: values.email,
          password: values.password,
        });
        console.log("Login successfully:", response.data);
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("userType", response.data.role);

        setStatus({
          type: "success",
          message: "Login successful! Redirecting...",
        });

        toast.success("Login successfully");

        setTimeout(() => {
          if (from) {
            navigate(from, { replace: true });
          } else {
            if (response.data.role === "patient") {
              navigate("/patient", { replace: true });
            } else if (response.data.role === "nurse") {
              navigate("/nurse", { replace: true });
              localStorage.setItem("kyc", "pending");
            } else if (response.data.role === "chw") {
              navigate("/chw", { replace: true });
            } else {
              navigate("/admin", { replace: true });
            }
          }
        }, 2000);
      } catch (error: any) {
        console.error("Login failed:", error);
        setStatus({
          type: "error",
          message:
            error.response?.data?.message || "Login failed. Please try again.",
        });
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

  return (
    <div className="min-h-screen w-full bg-gray-50 py-12 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Side - Platform Benefits (Hidden on mobile) */}
          <div className="hidden lg:block w-full bg-primary-500 rounded-3xl p-12 text-white">
            {/* Animated Rings on Top */}
            <div className="w-full flex items-center justify-center mb-8">
              <div className="relative w-full max-w-80 h-80">
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 320 320">
                  <circle
                    cx="160"
                    cy="160"
                    r="150"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="8,12"
                    opacity="0.3"
                  />
                </svg>
                <svg className="absolute inset-0 w-full h-full animate-spin-reverse" viewBox="0 0 320 320">
                  <circle
                    cx="160"
                    cy="160"
                    r="110"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="6,10"
                    opacity="0.4"
                  />
                </svg>
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 320 320">
                  <circle
                    cx="160"
                    cy="160"
                    r="70"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4,8"
                    opacity="0.5"
                  />
                </svg>

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <Heart className="w-full max-w-16 h-16 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Below */}
            <div className="space-y-6 w-full">
              <div className="text-center">
                <h2 className="text-h3 text-white mb-3">Welcome Back to Toltimed</h2>
                <p className="text-body-base text-white opacity-90">
                  Access your healthcare dashboard and manage your appointments
                </p>
              </div>

              <div className="space-y-4 w-full">
                <div className="flex items-start gap-3 w-full">
                  <div className="w-full max-w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-full max-w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-body-base text-white">Manage your appointments and bookings</span>
                </div>
                <div className="flex items-start gap-3 w-full">
                  <div className="w-full max-w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-full max-w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-body-base text-white">Connect with healthcare professionals</span>
                </div>
                <div className="flex items-start gap-3 w-full">
                  <div className="w-full max-w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-full max-w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-body-base text-white">Access your health records securely</span>
                </div>
                <div className="flex items-start gap-3 w-full">
                  <div className="w-full max-w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-full max-w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-body-base text-white">Track your healthcare journey</span>
                </div>
              </div>

              <div className="w-full bg-white rounded-xl p-4 border-2 border-white">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-full max-w-5 h-5 text-primary-600" />
                  <span className="text-body-sm font-semibold text-gray-900">
                    Secure & encrypted platform
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-white border-opacity-30">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-h4 font-bold text-white">500+</div>
                    <div className="text-body-xs text-white opacity-80">Professionals</div>
                  </div>
                  <div>
                    <div className="text-h4 font-bold text-white">10K+</div>
                    <div className="text-body-xs text-white opacity-80">Patients</div>
                  </div>
                  <div>
                    <div className="text-h4 font-bold text-white">4.9★</div>
                    <div className="text-body-xs text-white opacity-80">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            {/* Logo & Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <Heart className="text-primary-600 text-3xl md:text-4xl" />
                <span className="text-xl font-bold ml-2">Toltimed</span>
              </div>
              <h1 className="text-h3 text-center text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-center text-body-base">
                Sign in to access your healthcare platform
              </p>
              {from && (
                <p className="text-body-sm text-primary-600 text-center mt-2 bg-primary-50 py-2 px-4 rounded-lg">
                  Please sign in to continue to your requested page
                </p>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* Status Messages */}
              {status && (
                <div
                  className={`p-4 rounded-lg flex items-center ${
                    status.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle className="w-full max-w-5 h-5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-full max-w-5 h-5 mr-2 flex-shrink-0" />
                  )}
                  <p className="text-body-sm">{status.message}</p>
                </div>
              )}

              <div className="w-full">
                <label htmlFor="email" className="block text-body-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${errors.email && touched.email ? "input-error" : ""}`}
                  placeholder="your@email.com"
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-body-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="relative w-full">
                <label htmlFor="password" className="block text-body-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={!showPassword ? "password" : "text"}
                  required
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${errors.password && touched.password ? "input-error" : ""}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={handleShowPassword}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {!showPassword ? (
                    <Eye className="w-full max-w-5 h-5" />
                  ) : (
                    <EyeOff className="w-full max-w-5 h-5" />
                  )}
                </button>
                {errors.password && touched.password && (
                  <p className="mt-1 text-body-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-body-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-body-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary-500 hover:bg-primary-600"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin w-full max-w-5 h-5" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="text-center w-full mt-6">
              <p className="text-body-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-body-xs text-gray-500 text-center">
                By signing in, you agree to our{" "}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
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
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;