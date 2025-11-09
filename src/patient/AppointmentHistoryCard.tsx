import { useState } from "react";
import { Calendar, MapPin, User, Home, Clock, Eye } from "lucide-react";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import RatingModal from "./components/Rating";

const PatientAppointmentHistoryCard = ({ appointment }: { appointment: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  console.log("Appointment:", appointment)


  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return "✓";
      case "pending":
        return "";
      case "rejected":
        return "✗";
      case "completed":
        return "✓";
      default:
        return "•";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate days
const appointmentDate: Date = new Date(appointment.date);
  const bookingDate: Date = new Date(appointment.bookingDate);
  const today: Date = new Date();

  const totalDays: number = Math.ceil(
    (appointmentDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysLeft: number = Math.ceil((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openReview = () => {
    setIsReviewOpen(!isReviewOpen);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-start justify-between  mb-4">
          <div className="flex md:items-center flex-col md:flex-col space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
              {appointment.doctor.avatar}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {appointment.doctor.name}
              </h3>
              <p className="text-sm text-gray-600">
                {appointment.doctor.specialty}
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full mt-2 md:mt-0 text-sm font-medium border ${getStatusColor(
              appointment.status
            )}`}
          >
            <span className="mr-1">{getStatusIcon(appointment.status)}</span>
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {appointment.date} at {appointment.time}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            {appointment.consultationType === "Home Visit" ? (
              <Home className="w-4 h-4 mr-2" />
            ) : (
              <MapPin className="w-4 h-4 mr-2" />
            )}
            <span className="text-sm">{appointment.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span className="text-sm">{appointment.consultationType}</span>
          </div>

          {/* Days Information */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>Total: {totalDays} days</span>
            </div>
            <div
              className={`font-medium ${
                daysLeft < 0
                  ? "text-red-600"
                  : daysLeft === 0
                  ? "text-orange-600"
                  : daysLeft <= 3
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {daysLeft < 0
                ? `${Math.abs(daysLeft)} days ago`
                : daysLeft === 0
                ? "Today"
                : `${daysLeft} days left`}
            </div>
          </div>
        </div>

        {/* Fee and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(appointment.fee)}
          </div>
          <button
            onClick={handleViewDetails}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>

        <div>
          {appointment.metadata.days_left == 0 && appointment.metadata.status =="started" && (
            <button
              onClick={openReview}
              className="flex items-center justify-center mt-2 bg-blue-500 py-3 w-full space-x-2 text-white hover:text-blue-800 text-base text-center font-medium transition-colors"
            >
              Review Session
            </button>
          )}
        </div>

        {/* Rejection Reason */}
        {appointment.status === "rejected" && appointment.rejectionReason && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">
              <strong>Reason for rejection:</strong>{" "}
              {appointment.rejectionReason}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AppointmentDetailsModal
        appointment={appointment}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <RatingModal
        nurseProfileId={appointment}
        isOpen={isReviewOpen}
        onClose={openReview}
      />
    </>
  );
};

export default PatientAppointmentHistoryCard;
