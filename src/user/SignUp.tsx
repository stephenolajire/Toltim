import React, { useState } from "react";
import { Heart, Clock, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormErrors {
  fullname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<"patient" | "nurse" | "chw">(
    "patient"
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const handleUserTypeChange = (type: "patient" | "nurse" | "chw") => {
    setUserType(type);
  };

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!fullname.trim()) newErrors.fullname = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Registration Data:", {
        fullname,
        email,
        phone,
        password,
        userType,
      });
      // Here you would typically send the data to your backend
      alert("Registration successful! (This is a demo)");
      navigate("/verification");
    }
  };

  const getUserTypeBanner = () => {
    switch (userType) {
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

  const getNameLabel = () => {
    switch (userType) {
      case "nurse":
        return "Full Name (as on license)";
      case "chw":
        return "Full Name (as on certification)";
      default:
        return "Full Name";
    }
  };

  const getEmailLabel = () => {
    switch (userType) {
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
                userType === "patient"
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
                userType === "nurse"
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
                userType === "chw"
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
          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700"
              >
                {getNameLabel()}
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.fullname ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                placeholder="Enter your full name"
              />
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

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
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                placeholder="+234 ..."
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {(userType === "nurse" || userType === "chw") && (
            <div className="bg-yellow-100 border border-yellow-200 py-4 px-3 rounded-lg">
              <p className="text-yellow-500 text-sm">
                <span className="font-bold">Next Step: </span>After creating
                your account, you'll complete our professional verification
                process including document upload and credential review.
              </p>
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
            >
              Sign up
            </button>
          </div>

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
