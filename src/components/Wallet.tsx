import {
  Eye,
  EyeOff,
  Plus,
  XCircle,
  Lock,
  TrendingUp,
  Minus,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../constant/api";
import { toast } from "react-toastify";
import { useWallet } from "../constant/GlobalContext";

const WalletBalance = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  const { data: wallet, isLoading, error } = useWallet();

  useEffect(() => {
    setUserRole(localStorage.getItem("userType"));
  }, []);

  const totalBalance = parseFloat(wallet?.balance || "0");
  const lockedBalance = parseFloat(wallet?.locked_balance || "0");
  const availableBalance = wallet?.available_balance || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const handleFund = async () => {
    try {
      const response = await api.post("wallet/fund/", {
        amount: fundAmount,
      });
      if (response.data) {
        toast.success("Wallet has been fundedsucessfully");
      }
      setShowFundModal(!setShowFundModal);
    } catch (error) {
      console.log(error);
      toast.error("An error occur pls try again later");
    }
  };

  if (isLoading) {
    return <div className="bg-white rounded-lg p-4 animate-pulse h-32" />;
  }

  if (error || !wallet) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-600">
          Failed to load wallet information
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-4">
      {/* Main Balance Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-green-100 text-xs mb-1">Total Balance</p>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">
              {showBalance ? formatCurrency(totalBalance) : "₦ •••••••"}
            </h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {showBalance ? (
                <EyeOff className="w-4 h-4 text-white/80" />
              ) : (
                <Eye className="w-4 h-4 text-white/80" />
              )}
            </button>
          </div>
        </div>

        {userRole === "patient" ? (
          <button
            onClick={() => setShowFundModal(true)}
            className="px-4 py-2 bg-white text-green-700 text-sm rounded-lg font-medium hover:bg-green-50 transition-all flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Fund
          </button>
        ) : (
          <button className="px-4 py-2 bg-white text-green-700 text-sm rounded-lg font-medium hover:bg-green-50 transition-all flex items-center gap-1">
            <Minus className="w-4 h-4" />
            Withdraw
          </button>
        )}
      </div>

      {/* Balance Breakdown - Only for patients */}
      {userRole === "patient" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-green-200" />
              <p className="text-green-100 text-xs">Available</p>
            </div>
            <p className="text-lg font-semibold text-white">
              {showBalance ? formatCurrency(availableBalance) : "₦ •••••"}
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <Lock className="w-3 h-3 text-orange-200" />
              <p className="text-green-100 text-xs">Locked</p>
            </div>
            <p className="text-lg font-semibold text-white">
              {showBalance ? formatCurrency(lockedBalance) : "₦ •••••"}
            </p>
          </div>
        </div>
      )}

      {/* Fund Modal - Keep existing modal code */}
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
