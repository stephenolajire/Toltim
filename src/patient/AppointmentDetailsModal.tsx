import { X, Star, Calendar, MapPin, Clock, FileText } from "lucide-react";

interface AppointmentDetailsModalProps {
  appointment: any; // Replace 'any' with the actual appointment type
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentDetailsModal = ({
  appointment,
  isOpen,
  onClose,
}: AppointmentDetailsModalProps) => {
  if (!isOpen || !appointment) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

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

  // Calculate days
  const appointmentDate: Date = new Date(appointment.date);
  const bookingDate: Date = new Date(appointment.bookingDate);
  const today: Date = new Date();

  const totalDays: number = Math.ceil(
    (appointmentDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysLeft: number = Math.ceil((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Appointment Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Doctor Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  {appointment.doctor.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {appointment.doctor.name}
                  </h3>
                  <p className="text-gray-600">
                    {appointment.doctor.specialty}
                  </p>
                  {appointment.doctor.rating && (
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {appointment.doctor.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Appointment Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Appointment Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Type:</p>
                    <p className="font-medium text-gray-900">
                      {appointment.consultationType}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Date & Time:</p>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="font-medium text-gray-900">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Location:</p>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="font-medium text-gray-900">
                        {appointment.location}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Fee:</p>
                    <p className="font-bold text-green-600 text-lg">
                      {formatCurrency(appointment.fee)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Patient Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Patient Name:</p>
                    <p className="font-medium text-gray-900">
                      {appointment.patientName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Booking Date:</p>
                    <p className="font-medium text-gray-900">
                      {appointment.bookingDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Appointment ID:</p>
                    <p className="font-medium text-gray-900">
                      {appointment.appointmentId}
                    </p>
                  </div>

                  {/* Days Information */}
                  <div>
                    <p className="text-sm text-gray-600">Total Days:</p>
                    <p className="font-medium text-gray-900">
                      {totalDays} days
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Days Left:</p>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <p
                        className={`font-medium ${
                          daysLeft < 0
                            ? "text-red-600"
                            : daysLeft === 0
                            ? "text-orange-600"
                            : "text-gray-900"
                        }`}
                      >
                        {daysLeft < 0
                          ? `${Math.abs(daysLeft)} days ago`
                          : daysLeft === 0
                          ? "Today"
                          : `${daysLeft} days left`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Symptoms/Reason for Visit */}
            {appointment.symptomsReason && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Symptoms/Reason for Visit
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{appointment.symptomsReason}</p>
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {appointment.additionalNotes && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Additional Notes
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <FileText className="w-5 h-5 mr-2 text-gray-400 mt-0.5" />
                    <p className="text-gray-700">
                      {appointment.additionalNotes}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {appointment.status === "rejected" &&
              appointment.rejectionReason && (
                <div className="mt-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">
                      Reason for Rejection
                    </h4>
                    <p className="text-red-700">
                      {appointment.rejectionReason}
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {(appointment.status === "accepted" ||
                appointment.status === "pending") && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Reschedule
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentDetailsModal;
