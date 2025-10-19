import React from "react";
import {TrendingUp, TrendingDown } from "lucide-react";
import { useWalletTransactions } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";

interface Transaction {
  id: string;
  type: "session" | "withdrawal";
  description: string;
  date: string;
  amount: number;
  patientName?: string;
}

const WalletEarnings: React.FC = () => {

  const {data:walletTransactions, isLoading, error} = useWalletTransactions()

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

  // const handleRequestWithdrawal = () => {
  //   console.log("Request withdrawal clicked");
  //   // Handle withdrawal request
  // };

  if(isLoading) {
    return <Loading/>
  }

  if (error) {
    return <Error/>
  }

  if (!walletTransactions) {
    return <Loading/>
  }

  console.log(walletTransactions)

  return (
    <div className="bg-white rounded-lg pb-10">
      
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
