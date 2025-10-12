import React from "react";
import { BiHeart } from "react-icons/bi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { Loader, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
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

  // Get the intended destination from location state, fallback to default routes
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
          // If there's a redirect path from ProtectedRoute, use that
          if (from) {
            navigate(from, { replace: true });
          } else {
            // Otherwise, use role-based routing as fallback
            if (response.data.role === "patient") {
              navigate("/patient", { replace: true });
            } else if (
              response.data.role === "nurse"
            ) {
              navigate("/nurse", { replace: true });
              localStorage.setItem("kyc", "pending")
            } else if (response.data.role === "chw") {
              navigate("/chw", { replace: true });
            }
             else {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 md:px-0">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <div className="flex items-center h-auto w-full justify-center">
            <BiHeart className="text-green-600 text-3xl md:text-4xl" />
            <span className="text-xl font-bold ml-0.5 sm:ml-2">Toltimed</span>
          </div>
          <h2 className="mt-3 text-center text-3xl text-gray-900">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center mt-1">
            Sign in to access your healthcare platform
          </p>
          {from && (
            <p className="text-sm text-blue-600 text-center mt-2">
              Please sign in to continue to your requested page
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-500"
              >
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
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email && touched.email
                    ? "border-red-300"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                placeholder="Enter your email"
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div className="relative w-full">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-500"
              >
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
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password && touched.password
                    ? "border-red-300"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                placeholder="Enter your password"
              />
              {!showPassword ? (
                <Eye
                  onClick={handleShowPassword}
                  className="absolute right-3 top-7.5 text-gray-400 text-lg cursor-pointer"
                />
              ) : (
                <EyeOff
                  onClick={handleShowPassword}
                  className="absolute right-3 top-7.5 text-gray-400 text-lg cursor-pointer"
                />
              )}
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center"></div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition duration-300 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
