import { useState } from "react";
import { X, Star, Send } from "lucide-react";
import api from "../../constant/api";
import { toast } from "react-toastify";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  nurseProfileId: string;
}

interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
}

interface RatingPayload {
  nurse_profile: string;
  rating: number;
  comment: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  nurseProfileId,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });

  const handleSubmit = async (): Promise<void> => {
    if (rating === 0) {
      setSubmitStatus({
        type: "error",
        message: "Please select a rating before submitting",
      });
      return;
    }

    setIsSubmitting(true);

    const payload: RatingPayload = {
      nurse_profile: nurseProfileId,
      rating: rating,
      comment: comment,
    };

    try {
        const response = await api.post("user/nurse-review/", payload);
        if (response.status == 201) {
            setIsSubmitting(false)
            toast.success("Review has been submitted succesfully")
            onClose()
            setComment("")
            setRating(0)
        }
    } catch (error) {
        console.log(error)
        toast.error("Something went wrong pls try again")
        onClose();
        setComment("");
        setRating(0);
    }

    
  };

  const handleClose = (): void => {
    setRating(0);
    setComment("");
    setSubmitStatus({ type: null, message: "" });
    onClose();
  };

  const getRatingLabel = (ratingValue: number): string => {
    switch (ratingValue) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Select your rating";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Rate Your Experience
          </h2>
          <p className="text-gray-600 text-sm">
            Your feedback helps us improve our services
          </p>
        </div>

        {/* Status Message */}
        {submitStatus.type && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Rating Stars */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            {getRatingLabel(rating)}
          </p>
        </div>

        {/* Comment Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Share your experience..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length} / 500 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Rating
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RatingModal