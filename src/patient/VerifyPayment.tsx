import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import api from "../constant/api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get reference from URL params or localStorage
        const reference =
          searchParams.get("reference") ||
          localStorage.getItem("paymentReference");

        if (!reference) {
          setStatus("error");
          setMessage("Payment reference not found");
          toast.error("Payment reference not found");
          setTimeout(() => navigate("/patient"), 3000);
          return;
        }

        // Call verification endpoint
        const response = await api.post("wallet/verify-funding/", {
          reference: reference,
        });

        if (response.data) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          toast.success("Wallet funded successfully!");

          // Clear the stored reference
          localStorage.removeItem("paymentReference");

          // Invalidate wallet query to refetch updated balance
          queryClient.invalidateQueries({ queryKey: ["wallet"] });

          // Redirect to patient dashboard after 2 seconds
          setTimeout(() => {
            navigate("/patient");
          }, 2000);
        }
      } catch (error: any) {
        console.error("Verification error:", error);
        setStatus("error");

        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Payment verification failed";
        setMessage(errorMessage);
        toast.error(errorMessage);

        // Redirect to patient dashboard after 3 seconds
        setTimeout(() => {
          navigate("/patient");
        }, 3000);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, queryClient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 sm:p-12 text-center">
        {status === "verifying" && (
          <>
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Verifying Payment
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Please wait while we confirm your transaction...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Payment Successful!
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6">{message}</p>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-green-800 text-sm font-medium">
                Your wallet has been updated. Redirecting you to dashboard...
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Verification Failed
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6">{message}</p>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 text-sm font-medium">
                If your account was debited, please contact support.
              </p>
            </div>
            <button
              onClick={() => navigate("/patient")}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPayment;
