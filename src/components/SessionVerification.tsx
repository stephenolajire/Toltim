import {
  useState,
  useRef,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { Shield, CheckCircle, XCircle, Clock } from "lucide-react";
import api from "../constant/api";
import { toast } from "react-toastify";

interface valueProp {
    booking_id:string;
    close: (value: boolean) => void;
}

const VerifySessionModal = ({booking_id, close}:valueProp) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleClose = () => {
    close(false);
  }

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 5 && value) {
      const completeOtp = [...newOtp.slice(0, 5), value].join("");
      if (completeOtp.length === 6) {
        handleSubmit(completeOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);

    // Focus the next empty input or last input
    const nextIndex = Math.min(newOtp.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if complete
    if (pastedData.length === 6) {
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (otpValue: string) => {
    setIsVerifying(true)
    setVerificationStatus("idle");
    const today = new Date().toISOString().split("T")[0];

    console.log(otpValue)
    console.log(today)

    try {
        const response = await api.post(
          `inpatient-caregiver/verify-code/${booking_id}/`, {
            date: today,
            code: otpValue
          }
        );

        if (response.data) {
            toast.success("OTP has been verified successfully")
            setIsVerifying(false)
            setVerificationStatus('success')
            handleClose()
        }


    } catch (err: unknown) {
        console.error(err)

        // Safely extract an error message from unknown
        const message =
          typeof err === "string"
            ? err
            : typeof err === "object" && err !== null
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ((err as any).response?.data?.error ?? (err as any).message ?? "An error occurred")
            : "An error occurred";

        toast.error(message)
        setIsVerifying(false)
        setVerificationStatus("error")
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setVerificationStatus("idle");
    inputRefs.current[0]?.focus();
    // Add resend OTP logic here
    console.log("Resending OTP...");
  };

  return (
    <div className="min-h-screen absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Session
          </h2>
          <p className="text-gray-600 text-sm">
            Enter the 6-digit code sent to your client
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <div className="flex gap-3 justify-center mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isVerifying || verificationStatus === "success"}
                className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  verificationStatus === "success"
                    ? "border-green-500 bg-green-50 text-green-600"
                    : verificationStatus === "error"
                    ? "border-red-500 bg-red-50 text-red-600 animate-shake"
                    : digit
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 bg-white text-gray-900"
                } focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
              />
            ))}
          </div>

          {/* Status Messages */}
          {isVerifying && (
            <div className="flex items-center justify-center gap-2 text-blue-600 text-sm">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Verification successful!</span>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="flex items-center justify-center gap-2 text-red-600 text-sm">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">
                Invalid code. Please try again.
              </span>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-6">
          <Clock className="w-4 h-4" />
          <span>
            Code expires in{" "}
            <span className="font-semibold text-gray-900">10 mins</span>
          </span>
        </div>

        {/* Resend */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={isVerifying}
            className="text-blue-600 font-semibold text-sm hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Resend Code
          </button>
        </div>

        {/* Manual Submit Button (optional) */}
        <button
          onClick={() => handleSubmit(otp.join(""))}
          disabled={
            otp.some((d) => !d) ||
            isVerifying ||
            verificationStatus === "success"
          }
          className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isVerifying ? "Verifying..." : "Verify Code"}
        </button>
      </div>
    </div>
  );
};

export default VerifySessionModal;
