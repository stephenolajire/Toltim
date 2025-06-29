import React, { useState } from "react";
import { Wallet, Plus, DollarSign, Clock } from "lucide-react";

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: "completed";
  type: "funding" | "payment";
}

const PatientFundingPayments: React.FC = () => {
  const [fundAmount, setFundAmount] = useState("");

  const transactions: Transaction[] = [
    {
      id: "1",
      title: "Wallet funding",
      date: "2024-06-25",
      amount: 50000,
      status: "completed",
      type: "funding",
    },
    {
      id: "2",
      title: "Post-surgical care payment",
      date: "2024-06-24",
      amount: -15000,
      status: "completed",
      type: "payment",
    },
    {
      id: "3",
      title: "Wound management",
      date: "2024-06-23",
      amount: -8000,
      status: "completed",
      type: "payment",
    },
    {
      id: "4",
      title: "Wallet funding",
      date: "2024-06-20",
      amount: 25000,
      status: "completed",
      type: "funding",
    },
  ];

  const quickFundAmounts = [5000, 10000, 25000, 50000];

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount);
    const sign = amount >= 0 ? "+" : "-";
    return `${sign}₦${absAmount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleQuickFund = (amount: number) => {
    setFundAmount(amount.toString());
  };

  const handleFundWallet = () => {
    if (fundAmount) {
      // Handle wallet funding logic here
      console.log(`Funding wallet with ₦${fundAmount}`);
      setFundAmount("");
    }
  };

  return (
    <div className="py-6 w-full bg-gray-200 min-h-screen px-4 sm:px-4 md:px-20 lg:px-50">
      {/* Header */}
      {/* <div className="flex items-center justify-center mb-8">
        <Heart className="w-6 h-6 text-green-500 mr-2" />
        <h1 className="text-xl font-semibold text-gray-800">Toltimed</h1>
      </div> */}

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Patient Funding & Payments
        </h2>
        <p className="text-gray-600">
          Manage your wallet and view transaction history
        </p>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Wallet Balance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <Wallet className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-600">
              Wallet Balance
            </h3>
          </div>
          <div className="">
            <p className="text-3xl font-bold text-green-500 mb-2">₦25,000</p>
            <p className="text-sm text-gray-500">Available Balance</p>
          </div>
        </div>

        {/* Fund Wallet */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <Plus className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-600">Fund Wallet</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">Add money to your wallet</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleFundWallet}
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            Fund Wallet
          </button>
        </div>

        {/* Quick Fund */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Quick Fund</h3>
          <p className="text-xs text-gray-500 mb-4">Popular amounts</p>

          <div className="grid grid-cols-1 gap-2">
            {quickFundAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickFund(amount)}
                className="w-full py-2 px-4 text-left border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                ₦{amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm border-gray-200 px-4 md:px-6 pb-3">
        <div className="p-6">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Transaction History
            </h3>
          </div>
          <p className="text-sm text-gray-600">Your recent transactions</p>
        </div>

        <div className="mb-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors border border-gray-200 mb-3 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === "funding"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.type === "funding" ? (
                    <DollarSign className="w-4 h-4" />
                  ) : (
                    <DollarSign className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {transaction.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <p
                  className={`text-lg font-semibold ${
                    transaction.amount >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatAmount(transaction.amount)}
                </p>
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-900 text-white">
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientFundingPayments;
