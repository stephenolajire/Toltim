import React from "react";
import { Heart, Shield, Lock, CheckCircle, AlertCircle, Loader, Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../constant/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ChangePasswordSchema = Yup.object({
  newpassword: Yup.string()
    .matches(
      passwordRegex,
      "New password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("New password is required"),
  confirmnewpassword: Yup.string()
    .oneOf([Yup.ref("newpassword")], "New passwords does not match")
    .required("Confirm new password is required"),
});

interface ChangePasswordValues {
    newpassword:string,
    confirmnewpassword: string
}

const ChangePassword: React.FC = () => {

    const [showPassword, setShowPassword] = React.useState <boolean> (false)
    const [showCPassword, setShowCPassword] = React.useState<boolean>(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleShowCPassword = () => {
      setShowCPassword(!showCPassword);
    };

    const tokenReset = localStorage.getItem("resetToken")
    const email = localStorage.getItem("email")
    const navigate = useNavigate()

  const formik = useFormik <ChangePasswordValues> ({
    initialValues: {
      newpassword: "",
      confirmnewpassword: "",
    },
    validationSchema: ChangePasswordSchema,

    onSubmit: async (values, {setSubmitting, setStatus}) => {
        try {
            setStatus(null)
            const response = await api.post("user/password-reset/confirm/", {
                new_password: values.newpassword,
                confirm_new_password: values.confirmnewpassword,
                reset_token:tokenReset,
                identifier:email
            })

            console.log(response.data)

            if (response.data) {
                setStatus({
                    type:"success",
                    message:"Password reset successfully"
                })
                toast.success("Password reset successfully")
                setTimeout(()=> {
                    navigate("/login")
                }, 2000)
            }
        } catch(error){
            console.log(error)

            setStatus({
                type:"error",
                message:"Something went wrong, pls try again"
            })

        } finally{
            setSubmitting(false)
        }
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 md:px-0 py-4">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <div className="flex items-center justify-center">
            <Heart className="text-green-600 text-3xl md:text-4xl" />
            <span className="text-xl font-bold ml-2">Toltimed</span>
          </div>
          <h2 className="mt-3 text-center text-3xl text-gray-900">
            Change Password
          </h2>
          <p className="text-gray-500 text-center mt-1">
            Create a new secure password for your account
          </p>
        </div>

        {/* Password Security Info Banner */}
        <div className="w-full bg-green-50 border border-green-200 py-4 px-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="text-green-600 text-xl" />
            <span className="text-green-700 text-base font-semibold ml-2">
              Secure Password Reset
            </span>
          </div>
          <p className="text-green-600 text-sm">
            Choose a strong password with at least 8 characters, including
            uppercase, lowercase, numbers, and symbols
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Change Password Form */}
          <form onSubmit={handleSubmit}>
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
                  htmlFor="newpassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="newpassword"
                    name="newpassword"
                    type={!showPassword ? "password" : "text"}
                    value={values.newpassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your new password"
                  />
                  <Lock className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                  {!showPassword ? (
                    <Eye
                      onClick={handleShowPassword}
                      className="absolute right-3 top-3.5 text-gray-400 text-lg"
                    />
                  ) : (
                    <EyeOff
                      onClick={handleShowPassword}
                      className="absolute right-3 top-3.5 text-gray-400 text-lg"
                    />
                  )}
                </div>
                {errors.newpassword && touched.newpassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.newpassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmnewpassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmnewpassword"
                    name="confirmnewpassword"
                    type={!showCPassword ? "password" : "text"}
                    value={values.confirmnewpassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Confirm your new password"
                  />
                  <Lock className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                  {!showCPassword ? (
                    <Eye
                      onClick={handleShowCPassword}
                      className="absolute right-3 top-3.5 text-gray-400 text-lg"
                    />
                  ) : (
                    <EyeOff
                      onClick={handleShowCPassword}
                      className="absolute right-3 top-3.5 text-gray-400 text-lg"
                    />
                  )}
                </div>
                {errors.confirmnewpassword && touched.confirmnewpassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmnewpassword}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
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
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>

          {/* Password Requirements */}
          <div className="bg-gray-50 border border-gray-200 py-4 px-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Password Requirements:
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Include at least one number</li>
              <li>• Include at least one special character</li>
            </ul>
          </div>

          {/* Back to Login Section */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
