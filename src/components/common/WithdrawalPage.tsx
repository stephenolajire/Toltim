import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../../constant/api";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Wallet,
  Lock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

// API Function
const initiateWithdrawal = async (data: {
  amount: string;
  password: string;
}) => {
  const response = await api.post("/wallet/initiate-withdrawal/", data);
  return response.data;
};

const WithdrawalPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Get user type from localStorage or context
  const userType = localStorage.getItem("userType") || ""; // Adjust based on your auth setup

  // Form State
  const [formData, setFormData] = useState({
    amount: "",
    password: "",
  });

  // Initiate Withdrawal Mutation
  const withdrawalMutation = useMutation({
    mutationFn: initiateWithdrawal,
    onSuccess: (data) => {
      toast.success(data.message || "Withdrawal processed successfully!");

      // Navigate based on user type after 2 seconds
      setTimeout(() => {
        if (userType.toLowerCase() === "nurse") {
          navigate("/nurse");
        } else if (userType.toLowerCase() === "chw") {
          navigate("/chw");
        } else {
          navigate("/wallet");
        }
      }, 2000);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to process withdrawal. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSubmitWithdrawal = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    withdrawalMutation.mutate(formData);
  };

  const canSubmit =
    formData.amount &&
    parseFloat(formData.amount) > 0 &&
    formData.password &&
    !withdrawalMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            disabled={withdrawalMutation.isPending}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Withdraw Funds
              </h1>
              <p className="text-gray-600">
                Enter amount and confirm your password
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Withdrawal Amount
                </h2>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">
                  ₦
                </span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                  disabled={withdrawalMutation.isPending}
                  className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-2xl font-bold text-gray-900 transition-all disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Quick Amount Selection */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Quick Amount
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[5000, 10000, 20000, 50000, 100000, 200000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: amount.toString(),
                      }))
                    }
                    disabled={withdrawalMutation.isPending}
                    className={`px-4 py-3 border-2 rounded-xl hover:bg-green-50 hover:border-green-600 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                      formData.amount === amount.toString()
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    ₦{(amount / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Your Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter your account password"
                  disabled={withdrawalMutation.isPending}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900 disabled:opacity-50 disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={withdrawalMutation.isPending}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This is your account password for security verification
              </p>
            </div>

            {/* Warning Notice */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Important Notice
                </p>
                <p className="text-sm text-amber-700">
                  Withdrawals will be processed to your registered bank account.
                  Please ensure your account details are up to date.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitWithdrawal}
              disabled={!canSubmit}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {withdrawalMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Withdrawal...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Withdraw Funds
                </>
              )}
            </button>
          </div>
        </div>

        {/* Processing Overlay */}
        {withdrawalMutation.isPending && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Processing Withdrawal
              </h3>
              <p className="text-gray-600">
                Please wait while we process your withdrawal request...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalPage;
