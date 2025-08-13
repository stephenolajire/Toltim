import React from "react";

interface PaymentItem {
  id: string;
  name: string;
  bankInfo: string;
  requestedDate: string;
  amount: number;
  status: "pending" | "completed";
  processedDate?: string;
  type: string;
}

const PaymentManagement: React.FC = () => {
  const payments: PaymentItem[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      bankInfo: "GTBank - 0123456789",
      requestedDate: "2024-06-24",
      amount: 45000,
      status: "pending",
      type: "commission",
    },
    {
      id: "2",
      name: "Nurse Mary Okafor",
      bankInfo: "First Bank - 0987654321",
      requestedDate: "2024-06-23",
      amount: 28500,
      status: "completed",
      processedDate: "2024-06-24",
      type: "commission",
    },
  ];

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
        Payment Management
      </h1>

      <div className="space-y-4 sm:space-y-6">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6"
          >
            {/* Mobile Layout */}
            <div className="block sm:hidden space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {payment.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {payment.bankInfo}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requested: {formatDate(payment.requestedDate)}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {payment.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {formatAmount(payment.amount)}
                  </div>
                  <span
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>

              {payment.status === "completed" && payment.processedDate && (
                <p className="text-xs text-gray-500">
                  Processed: {formatDate(payment.processedDate)}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                {payment.status === "pending" && (
                  <>
                    <button className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                      Process Payment
                    </button>
                    <button className="flex-1 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Desktop/Tablet Layout */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {payment.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {payment.bankInfo}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>
                          Requested: {formatDate(payment.requestedDate)}
                        </span>
                        {payment.status === "completed" &&
                          payment.processedDate && (
                            <span>
                              Processed: {formatDate(payment.processedDate)}
                            </span>
                          )}
                      </div>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {payment.type}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-4 lg:gap-6 mt-4 lg:mt-0">
                      <div className="text-right">
                        <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                          {formatAmount(payment.amount)}
                        </div>
                        <span
                          className={`inline-block mt-1 px-3 py-1 text-sm rounded-full ${
                            payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>

                      <div className="flex  gap-2">
                        {payment.status === "pending" && (
                          <>
                            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">
                              Process Payment
                            </button>
                            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentManagement;
