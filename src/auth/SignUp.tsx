import React, { useState } from "react";
import { Heart, Clock, Shield, Users } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import signUpSchema from "./SignupSchema";
import api from "../constant/api";

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
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null); // Clear any previous status

        const response = await api.post("user/signup/", {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phonenumber: values.phonenumber,
          password: values.password,
          confirmpassword: values.confirmpassword,
          role: values.role,
        });

        console.log("Registration successful:", response.data);

        // Handle successful registration
        // You might want to redirect to login page or show success message
        // navigate("/login"); // Uncomment if using navigation
        setStatus({
          type: "success",
          message:
            "Registration successful! Please check your email to verify your account.",
        });
      } catch (error: any) {
        console.error("Registration failed:", error);

        // Handle different types of errors
        if (error.response?.data) {
          // Server returned an error response
          const errorMessage =
            error.response.data.message ||
            "Registration failed. Please try again.";
          setStatus({ type: "error", message: errorMessage });
        } else if (error.request) {
          // Network error
          setStatus({
            type: "error",
            message:
              "Network error. Please check your connection and try again.",
          });
        } else {
          // Other error
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

  // Fixed destructuring
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
    // Update Formik value as well
    formik.setFieldValue("role", type);
  };

  // ... rest of your component remains the same

  const getUserTypeBanner = () => {
    switch (role) {
      case "nurse":
        return (
          <div className="w-full bg-green-50 border border-green-200 py-3 px-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="text-green-600 text-xl" />
              <span className="text-green-700 text-base font-semibold ml-2">
                Nurse Registration
              </span>
            </div>
            <p className="text-green-600 text-sm mb-2">
              Join our platform as a verified healthcare professional
            </p>
            <div className="flex items-center">
              <Clock className="text-green-600 text-sm" />
              <span className="text-green-600 text-sm ml-2">
                Verification process: 24-48 hours
              </span>
            </div>
          </div>
        );
      case "chw":
        return (
          <div className="w-full bg-purple-50 border border-purple-200 py-3 px-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="text-purple-600 text-xl" />
              <span className="text-purple-700 text-base font-semibold ml-2">
                Community Health Worker Registration
              </span>
            </div>
            <p className="text-purple-600 text-sm mb-2">
              Connect communities with essential healthcare services
            </p>
            <div className="flex items-center">
              <Clock className="text-purple-600 text-sm" />
              <span className="text-purple-600 text-sm ml-2">
                Verification process: 48-72 hours
              </span>
            </div>
          </div>
        );
      default: // patient
        return (
          <div className="w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Heart className="text-blue-600 text-xl" />
              <span className="text-blue-700 text-base font-semibold ml-2">
                Patient Registration
              </span>
            </div>
            <p className="text-blue-600 text-sm">
              Get instant access to qualified nurses and community health
              workers for healthcare services
            </p>
          </div>
        );
    }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 md:px-0 py-4">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <div className="flex items-center justify-center">
            <Heart className="text-green-600 text-3xl md:text-4xl" />
            <span className="text-xl font-bold ml-2">Toltimed</span>
          </div>
          <h2 className="mt-3 text-center text-3xl text-gray-900">
            Join Toltimed
          </h2>
          <p className="text-gray-500 text-center mt-1">
            Create your account to access quality healthcare
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* User Type Toggle */}
          <div className="bg-gray-100 grid grid-cols-3 items-center h-10 p-1 rounded">
            <button
              type="button"
              className={`w-full h-8 flex items-center justify-center text-xs font-medium rounded transition-all ${
                role === "patient"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => handleUserTypeChange("patient")}
            >
              Patient
            </button>
            <button
              type="button"
              className={`w-full h-8 flex items-center justify-center text-xs font-medium rounded transition-all ${
                role === "nurse"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => handleUserTypeChange("nurse")}
            >
              Nurse
            </button>
            <button
              type="button"
              className={`w-full h-8 flex items-center justify-center text-xs font-medium rounded transition-all ${
                role === "chw"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => handleUserTypeChange("chw")}
            >
              CHW
            </button>
          </div>

          {/* User Type Info Banner */}
          {getUserTypeBanner()}

          {/* Form Fields */}
          <form onSubmit={handleSubmit}>
            {/* Status Messages */}
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

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700"
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
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.first_name && touched.first_name
                      ? "border-red-300"
                      : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  placeholder="Enter your first name"
                />
                {errors.first_name && touched.first_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700"
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
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.last_name && touched.last_name
                      ? "border-red-300"
                      : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  placeholder="Enter your last name"
                />
                {errors.last_name && touched.last_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.last_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
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

              <div>
                <label
                  htmlFor="phonenumber"
                  className="block text-sm font-medium text-gray-700"
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
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.phonenumber && touched.phonenumber
                      ? "border-red-300"
                      : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  placeholder="+234 ..."
                />
                {errors.phonenumber && touched.phonenumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phonenumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
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
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.password && touched.password
                      ? "border-red-300"
                      : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  placeholder="Enter your password"
                />
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmpassword"
                  className="block text-sm font-medium text-gray-700"
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
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.confirmpassword && touched.confirmpassword
                      ? "border-red-300"
                      : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  placeholder="Confirm your password"
                />
                {errors.confirmpassword && touched.confirmpassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmpassword}
                  </p>
                )}
              </div>
            </div>

            {(role === "nurse" || role === "chw") && (
              <div className="bg-yellow-100 border border-yellow-200 py-4 px-3 rounded-lg mt-4">
                <p className="text-yellow-700 text-sm">
                  <span className="font-bold">Next Step: </span>After creating
                  your account, you'll complete our professional verification
                  process including document upload and credential review.
                </p>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
              >
                {isSubmitting ? "Submitting..." : "Sign up"}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
