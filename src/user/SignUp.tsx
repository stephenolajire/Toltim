import React, { useState} from "react";
import { Heart, Clock, Shield } from "lucide-react";

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
  const [userType, setUserType] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handlePatient = () => setUserType(false);
  const handleNurse = () => setUserType(true);

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

  const handleSubmit = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Registration Data:", {
        fullname,
        email,
        phone,
        password,
        userType: userType ? "nurse" : "patient",
      });
      // Here you would typically send the data to your backend
      alert("Registration successful! (This is a demo)");
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
          <div className="bg-gray-100 grid grid-cols-2 items-center h-10 p-1 rounded">
            <button
              type="button"
              className={`w-full h-8 flex items-center justify-center text-sm font-medium rounded transition-all ${
                !userType
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={handlePatient}
            >
              Patient
            </button>
            <button
              type="button"
              className={`w-full h-8 flex items-center justify-center text-sm font-medium rounded transition-all ${
                userType
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={handleNurse}
            >
              Nurse
            </button>
          </div>

          {/* User Type Info Banner */}
          {userType ? (
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
          ) : (
            <div className="w-full bg-blue-50 border border-blue-200 py-3 px-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Heart className="text-blue-600 text-xl" />
                <span className="text-blue-700 text-base font-semibold ml-2">
                  Patient Registration
                </span>
              </div>
              <p className="text-blue-600 text-sm">
                Get instant access to qualified nurses for home healthcare
                services
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              {userType ? (
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name (as on license)
                </label>
              ) : (
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
              )}
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
              {userType ? (
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Professional Email Address
                </label>
              ) : (
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
              )}
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

          {userType && (
            <div className="bg-yellow-100 border border-yellow-200 py-4 px-3 rounded-lg">
              <p className="text-yellow-500 text-sm">
                <span className="font-bold">Next Step: </span>After creating your account, you'll
                complete our professional verification process including
                document upload and credential review.
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
                href="#"
                className="font-medium text-green-600 hover:text-green-500"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Sign in functionality would be implemented here");
                }}
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
