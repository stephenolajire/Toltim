import {
  Eye,
  EyeOff,
  Plus,
  Wallet,
  XCircle,
  Lock,
  TrendingUp,
  Minus,
} from "lucide-react";
import { useState } from "react";
import api from "../constant/api";
import { toast } from "react-toastify";
import { useWallet } from "../constant/GlobalContext";

const role = localStorage.getItem("userType")

const WalletBalance = () => {
  const { data: wallet, isLoading, error } = useWallet();

  const [showBalance, setShowBalance] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const totalBalance = parseFloat(wallet?.balance || "0");
  const lockedBalance = parseFloat(wallet?.locked_balance || "0");
  const availableBalance = wallet?.available_balance || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const handleFund = async() => {
    try {
        const response  =  await api.post("wallet/fund/", {
        amount: fundAmount
      });
      if (response.data) {
        toast.success("Wallet has been fundedsucessfully")
      }
      setShowFundModal(!setShowFundModal)
    } catch(error) {
      console.log(error)
      toast.error("An error occur pls try again later")
    }
    
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-red-600">
        <p className="text-center">Failed to load wallet information</p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10">
        {/* Main Balance Section */}
        <div className="md:flex grid grid-cols-1 items-start justify-between mb-8">
          <div className="flex-1">
            <p className="text-green-100 text-sm mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Total Wallet Balance
            </p>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="md:text-5xl text-4xl font-bold">
                {showBalance ? formatCurrency(totalBalance) : "₦ •••••••"}
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {showBalance ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Balance Breakdown */}
            {role == "patient" && (
              <div className="">
                <div className="w-full content-center grid md:grid-cols-2 grid-cols-1 gap-4 mt-6">
                  {/* Available Balance */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-200" />
                      <p className="text-green-100 text-xs font-medium">
                        Available Balance
                      </p>
                    </div>
                    <p className="text-2xl font-bold">
                      {showBalance
                        ? formatCurrency(availableBalance)
                        : "₦ •••••"}
                    </p>
                    <p className="text-xs text-green-200 mt-1">
                      Ready to spend
                    </p>
                  </div>

                  {/* Locked Balance */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-orange-200" />
                      <p className="text-green-100 text-xs font-medium">
                        Locked Balance
                      </p>
                    </div>
                    <p className="text-2xl font-bold">
                      {showBalance ? formatCurrency(lockedBalance) : "₦ •••••"}
                    </p>
                    <p className="text-xs text-green-200 mt-1">
                      Pending transactions
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-5 md:mt-0 items-center justify-center md:ml-6">
            {role == "patient" ? (
              <button
                onClick={() => setShowFundModal(true)}
                className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all shadow-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Fund Wallet
              </button>
            ) : (
              <button
                // onClick={() => setShowFundModal(true)}
                className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all shadow-lg flex items-center gap-2"
              >
                <Minus className="w-5 h-5" />
                Withdraw
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fund Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Fund Wallet</h3>
              <button
                onClick={() => setShowFundModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  ₦
                </span>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-gray-700">Quick Amount</p>
              <div className="grid grid-cols-3 gap-3">
                {[5000, 10000, 20000, 50000, 100000, 200000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setFundAmount(amount.toString())}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    ₦{(amount / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFund}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Continue to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletBalance;
