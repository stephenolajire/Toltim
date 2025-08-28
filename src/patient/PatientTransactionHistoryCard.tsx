import { useState } from "react";
import { Calendar, Plus, Minus, Eye } from "lucide-react";
import TransactionDetailsModal from "./TransactionDetailsModal";

const PatientTransactionHistoryCard = ({
  transaction,
}: {
  transaction: any;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getIconBgColor = (type: string) => {
    return type === "deposit" ? "bg-green-100" : "bg-blue-100";
  };

  const getIconColor = (type: string) => {
    return type === "deposit" ? "text-green-600" : "text-blue-600";
  };

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(absAmount);

    return isNegative
      ? `-${formatted.replace("₦", "₦")}`
      : `+${formatted.replace("₦", "₦")}`;
  };

  const getAmountColor = (amount: number) => {
    return amount < 0 ? "text-blue-600" : "text-green-600";
  };

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between">
          {/* Left side - Icon and transaction details */}
          <div className="flex items-start space-x-3 flex-1">
            {/* Transaction Icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconBgColor(
                transaction.type
              )}`}
            >
              {transaction.type === "deposit" ? (
                <Plus className={`w-5 h-5 ${getIconColor(transaction.type)}`} />
              ) : (
                <Minus
                  className={`w-5 h-5 ${getIconColor(transaction.type)}`}
                />
              )}
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-semibold text-gray-900">
                  {transaction.title}
                </h3>
                {/* Status Badge */}
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    transaction.status
                  )} flex items-center space-x-1`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                  <span>
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {transaction.description}
              </p>

              {/* Transaction metadata */}
              <div className="space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{transaction.date}</span>
                </div>

                <div className="flex items-center text-xs text-gray-500">
                  <div className="w-3 h-3 mr-1 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
                  </div>
                  <span>{transaction.paymentMethod}</span>
                </div>

                {transaction.reference && (
                  <div className="text-xs text-gray-500">
                    Ref: {transaction.reference}
                  </div>
                )}
              </div>

              {/* Amount and View Details */}
              <div className="flex items-center justify-between mt-3">
                <div
                  className={`text-lg font-bold ${getAmountColor(
                    transaction.amount
                  )}`}
                >
                  {formatCurrency(transaction.amount)}
                </div>

                <button
                  onClick={handleViewDetails}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <TransactionDetailsModal
        transaction={transaction}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default PatientTransactionHistoryCard;
