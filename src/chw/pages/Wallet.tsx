import React from "react";
import { Wallet, Clock, TrendingUp, TrendingDown } from "lucide-react";

interface Transaction {
  id: string;
  type: "session" | "withdrawal";
  description: string;
  date: string;
  amount: number;
  patientName?: string;
}

const WalletEarnings: React.FC = () => {
  const walletBalance = 125000;
  const pendingEarnings = 34000;

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "session",
      description: "Session with Sarah Johnson",
      date: "June 23, 2024",
      amount: 8000,
      patientName: "Sarah Johnson",
    },
    {
      id: "2",
      type: "session",
      description: "Session with Michael Adebayo",
      date: "June 22, 2024",
      amount: 10000,
      patientName: "Michael Adebayo",
    },
    {
      id: "3",
      type: "withdrawal",
      description: "Withdrawal to Bank",
      date: "June 20, 2024",
      amount: -50000,
    },
  ];

  const formatCurrency = (amount: number): string => {
    return `₦${Math.abs(amount).toLocaleString()}`;
  };

  const handleRequestWithdrawal = () => {
    console.log("Request withdrawal clicked");
    // Handle withdrawal request
  };

  return (
    <div className="bg-white rounded-lg pb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Wallet & Earnings
      </h2>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Wallet Balance Card */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
              <Wallet className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Wallet Balance
            </h3>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold text-green-600">
              {formatCurrency(walletBalance)}
            </span>
          </div>

          <button
            onClick={handleRequestWithdrawal}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            Request Withdrawal
          </button>
        </div>

        {/* Pending Earnings Card */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Pending Earnings
            </h3>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold text-orange-600">
              {formatCurrency(pendingEarnings)}
            </span>
          </div>

          <p className="text-sm text-gray-600">
            Earnings from ongoing treatments (will be credited after completion)
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recent Transactions
        </h3>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === "session"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {transaction.type === "session" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>

                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>

              <div
                className={`font-semibold ${
                  transaction.amount > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {transaction.amount > 0 ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No recent transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletEarnings;
