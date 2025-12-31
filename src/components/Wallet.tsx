import {
  Eye,
  EyeOff,
  Plus,
  XCircle,
  Lock,
  TrendingUp,
  Minus,
  Wallet,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import api from "../constant/api";
import { toast } from "react-toastify";
import { useWallet } from "../constant/GlobalContext";

const WalletBalance = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: wallet, isLoading, error } = useWallet();

  useEffect(() => {
    setUserRole(localStorage.getItem("userType"));
  }, []);

  // Theme configuration based on role
  const themeConfig = useMemo(() => {
    const configs = {
      patient: {
        gradient: "from-blue-600 to-blue-700",
        gradientDark: "from-primary-700 to-primary-800",
        hoverBg: "hover:bg-primary-50",
        textColor: "text-primary-700",
        ringColor: "ring-primary-500",
        focusRing: "focus:ring-primary-500",
        lightBg: "bg-primary-100",
        iconColor: "text-primary-200",
      },
      nurse: {
        gradient: "from-green-600 to-green-700",
        gradientDark: "from-green-700 to-green-800",
        hoverBg: "hover:bg-green-50",
        textColor: "text-green-700",
        ringColor: "ring-green-500",
        focusRing: "focus:ring-green-500",
        lightBg: "bg-green-100",
        iconColor: "text-green-200",
      },
      chw: {
        gradient: "from-purple-600 to-purple-700",
        gradientDark: "from-purple-700 to-purple-800",
        hoverBg: "hover:bg-purple-50",
        textColor: "text-purple-700",
        ringColor: "ring-purple-500",
        focusRing: "focus:ring-purple-500",
        lightBg: "bg-purple-100",
        iconColor: "text-purple-200",
      },
      admin: {
        gradient: "from-gray-700 to-gray-800",
        gradientDark: "from-gray-800 to-gray-900",
        hoverBg: "hover:bg-gray-50",
        textColor: "text-gray-700",
        ringColor: "ring-gray-500",
        focusRing: "focus:ring-gray-500",
        lightBg: "bg-gray-100",
        iconColor: "text-gray-200",
      },
    };
    return configs[userRole as keyof typeof configs] || configs.patient;
  }, [userRole]);

  const totalBalance = parseFloat(wallet?.balance || "0");
  const lockedBalance = parseFloat(wallet?.locked_balance || "0");
  const availableBalance = wallet?.available_balance || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleFund = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.post("wallet/initiate-funding/", {
        amount: fundAmount,
      });

      if (
        response.data &&
        response.data.payment_url &&
        response.data.reference
      ) {
        // Store the reference in localStorage for verification later
        localStorage.setItem("paymentReference", response.data.reference);

        toast.info("Redirecting to payment gateway...");

        // Redirect to payment URL
        window.location.href = response.data.payment_url;
      } else {
        toast.error("Invalid payment response received");
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Funding error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred, please try again later"
      );
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 animate-pulse">
        <div className="h-24 sm:h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-red-600">
            Failed to load wallet information
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`bg-gradient-to-br ${themeConfig.gradient} rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6`}
      >
        {/* Main Balance Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">
                Total Balance
              </p>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                  {showBalance ? formatCurrency(totalBalance) : "₦ •••••••"}
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all flex-shrink-0"
                >
                  {showBalance ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {userRole === "patient" ? (
            <button
              onClick={() => setShowFundModal(true)}
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-gray-900 text-xs sm:text-sm rounded-lg sm:rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Fund Wallet
            </button>
          ) : (
            <button className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-gray-900 text-xs sm:text-sm rounded-lg sm:rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
              <Minus className="w-4 h-4" />
              Withdraw
            </button>
          )}
        </div>

        {/* Balance Breakdown - Only for patients */}
        {userRole === "patient" && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                </div>
                <p className="text-white/90 text-xs sm:text-sm font-medium truncate">
                  Available
                </p>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                {showBalance ? formatCurrency(availableBalance) : "₦ •••••"}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-500/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
                </div>
                <p className="text-white/90 text-xs sm:text-sm font-medium truncate">
                  Locked
                </p>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                {showBalance ? formatCurrency(lockedBalance) : "₦ •••••"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fund Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${themeConfig.gradient} rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Fund Wallet
                </h3>
              </div>
              <button
                onClick={() => setShowFundModal(false)}
                disabled={isProcessing}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors flex-shrink-0 disabled:opacity-50"
              >
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
            </div>

            <div className="mb-5 sm:mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-base sm:text-lg">
                  ₦
                </span>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={isProcessing}
                  className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 ${themeConfig.focusRing} focus:border-transparent text-lg sm:text-xl font-bold text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <p className="text-sm font-semibold text-gray-700">
                Quick Amount
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[5000, 10000, 20000, 50000, 100000, 200000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setFundAmount(amount.toString())}
                    disabled={isProcessing}
                    className={`px-2 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl ${
                      themeConfig.hoverBg
                    } hover:border-transparent transition-all text-xs sm:text-sm font-semibold text-gray-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                      fundAmount === amount.toString()
                        ? `border-transparent ${themeConfig.lightBg} ${themeConfig.textColor}`
                        : ""
                    }`}
                  >
                    ₦{(amount / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFund}
              disabled={
                !fundAmount || parseFloat(fundAmount) <= 0 || isProcessing
              }
              className={`w-full py-2.5 sm:py-3.5 bg-blue-600 text-white rounded-lg sm:rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none text-sm sm:text-base`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Continue to Payment
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletBalance;
