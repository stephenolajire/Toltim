import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Menu, Heart, Plus, Eye, EyeOff, Wallet, XCircle } from "lucide-react";

const WalletBalance = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const walletBalance = 125750;

  return (
    <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10">
        <div className="md:flex grid grid-cols-1  items-center justify-between mb-8">
          <div>
            <p className="text-green-100 text-sm mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Available Balance
            </p>
            <div className="flex items-center gap-4">
              <h2 className="md:text-5xl text-4xl font-bold">
                {showBalance ? formatCurrency(walletBalance) : "₦ •••••••"}
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
          </div>
          <div className="flex gap-3 mt-5 md:mt-0 items-center justify-center">
            <button
              onClick={() => setShowFundModal(true)}
              className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Fund Wallet
            </button>
          </div>
        </div>
      </div>

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
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
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
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-sm font-medium"
                  >
                    ₦{(amount / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Continue to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white shadow-sm">
          <button
            onClick={openSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Toltimed
            </span>
          </div>
          <div className="w-10"></div>
        </div>

        <main className="flex-1 overflow-auto p-4">
          <WalletBalance />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
