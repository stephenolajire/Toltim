import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../constant/api";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Wallet,
  Building2,
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

// API Functions
const fetchBanks = async () => {
  const response = await api.get("/wallet/banks/");
  return response.data;
};

const validateAccount = async (data: {
  account_number: string;
  bank_code: string;
}) => {
  const response = await api.post("/wallet/validate-account/", data);
  return response.data;
};

const initiateWithdrawal = async (data: {
  amount: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  account_name: string;
  password: string;
}) => {
  const response = await api.post("/wallet/initiate-withdrawal/", data);
  return response.data;
};

const WithdrawalPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    amount: "",
    bank_code: "",
    bank_name: "",
    account_number: "",
    account_name: "",
    password: "",
  });

  const [accountVerified, setAccountVerified] = useState(false);

  // Fetch Banks
  const {
    data: banks,
    isLoading: banksLoading,
    error: banksError,
  } = useQuery({
    queryKey: ["banks"],
    queryFn: fetchBanks,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Validate Account Mutation
  const validateMutation = useMutation({
    mutationFn: validateAccount,
    onSuccess: (data) => {
      setFormData((prev) => ({
        ...prev,
        account_name: data.account_name || data.data?.account_name || "",
      }));
      setAccountVerified(true);
      toast.success("Account verified successfully!");
      setStep(3);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to verify account. Please check your details."
      );
      setAccountVerified(false);
    },
  });

  // Initiate Withdrawal Mutation
  const withdrawalMutation = useMutation({
    mutationFn: initiateWithdrawal,
    onSuccess: (data) => {
      if (data.payment_url) {
        toast.success("Withdrawal initiated successfully!");
        window.location.href = data.payment_url;
      } else {
        toast.success("Withdrawal request submitted successfully!");
        setTimeout(() => navigate("/wallet"), 2000);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to process withdrawal. Please try again."
      );
    },
  });

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBank = banks?.find(
      (bank: any) => bank.code === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      bank_code: e.target.value,
      bank_name: selectedBank?.name || "",
    }));
    setAccountVerified(false);
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, account_number: value }));
    setAccountVerified(false);
  };

  const handleVerifyAccount = () => {
    if (!formData.account_number || formData.account_number.length !== 10) {
      toast.error("Please enter a valid 10-digit account number");
      return;
    }
    if (!formData.bank_code) {
      toast.error("Please select a bank");
      return;
    }

    validateMutation.mutate({
      account_number: formData.account_number,
      bank_code: formData.bank_code,
    });
  };

  const handleSubmitWithdrawal = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }
    if (!accountVerified) {
      toast.error("Please verify your account first");
      return;
    }

    withdrawalMutation.mutate(formData);
  };

  const canProceedToStep2 = formData.amount && parseFloat(formData.amount) > 0;
  const canVerifyAccount =
    formData.bank_code &&
    formData.account_number.length === 10 &&
    !validateMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
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
                Transfer money to your bank account
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step >= num
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > num ? <CheckCircle className="w-5 h-5" /> : num}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium ${
                      step >= num ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {num === 1 && "Amount"}
                    {num === 2 && "Bank Details"}
                    {num === 3 && "Confirm"}
                  </p>
                </div>
                {num < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      step > num ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Step 1: Enter Amount */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Enter Withdrawal Amount
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
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-2xl font-bold text-gray-900 transition-all"
                  />
                </div>
              </div>

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
                      className={`px-4 py-3 border-2 rounded-xl hover:bg-green-50 hover:border-green-600 transition-all text-sm font-semibold ${
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

              <button
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Bank Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Bank Account Details
                </h2>
              </div>

              {/* Bank Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Bank
                </label>
                <div className="relative">
                  <select
                    value={formData.bank_code}
                    onChange={handleBankChange}
                    disabled={banksLoading}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white font-medium text-gray-900 disabled:opacity-50"
                  >
                    <option value="">
                      {banksLoading ? "Loading banks..." : "Choose your bank"}
                    </option>
                    {banks?.map((bank: any) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {banksError && (
                  <p className="text-red-500 text-sm mt-2">
                    Failed to load banks. Please refresh the page.
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={handleAccountNumberChange}
                    placeholder="0123456789"
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900"
                  />
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyAccount}
                disabled={!canVerifyAccount}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {validateMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Verify Account
                  </>
                )}
              </button>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm & Password */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Confirm Withdrawal
                </h2>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-green-300">
                    <span className="text-green-700 font-medium">Amount</span>
                    <span className="text-2xl font-bold text-green-900">
                      ₦{parseFloat(formData.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Bank</span>
                    <span className="font-semibold text-green-900">
                      {formData.bank_name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">
                      Account Number
                    </span>
                    <span className="font-semibold text-green-900">
                      {formData.account_number}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">
                      Account Name
                    </span>
                    <span className="font-semibold text-green-900">
                      {formData.account_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Password */}
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
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

              {/* Warning */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Important Notice
                  </p>
                  <p className="text-sm text-amber-700">
                    Please ensure all details are correct before proceeding.
                    Withdrawals cannot be reversed once processed.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  disabled={withdrawalMutation.isPending}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitWithdrawal}
                  disabled={
                    !formData.password ||
                    !accountVerified ||
                    withdrawalMutation.isPending
                  }
                  className="flex-1 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {withdrawalMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Complete Withdrawal
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPage;
