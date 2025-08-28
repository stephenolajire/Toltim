import { X, Minus, CheckCircle } from "lucide-react";

interface Transaction {
  amount: number;
  status: string;
  type: string;
  title: string;
  description: string;
  date: string;
  paymentMethod: string;
  reference: string;
}

interface TransactionDetailsModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetailsModal = ({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailsModalProps) => {
  if (!isOpen) return null;

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "pending":
        return <span className="mr-1">⏳</span>;
      case "failed":
        return <X className="w-4 h-4 mr-1" />;
      default:
        return <span className="mr-1">•</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Transaction Details
          </h2>

          {/* Transaction Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Minus className="w-8 h-8 text-blue-600" />
          </div>

          {/* Amount */}
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatCurrency(transaction.amount)}
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              transaction.status
            )}`}
          >
            {getStatusIcon(transaction.status)}
            <span>
              {transaction.status.charAt(0).toUpperCase() +
                transaction.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 mb-6" />

        {/* Transaction Details */}
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Transaction Type:</div>
            <div className="text-base font-medium text-gray-900">
              {transaction.type === "deposit" ? "Deposit" : "Payment"}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Description:</div>
            <div className="text-base text-gray-900">
              {transaction.description}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Date:</div>
            <div className="text-base text-gray-900">{transaction.date}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Payment Method:</div>
            <div className="text-base text-gray-900">
              {transaction.paymentMethod}
            </div>
          </div>

          {transaction.reference && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Transaction ID:</div>
              <div className="text-base text-gray-900">
                {transaction.reference}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
