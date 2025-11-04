import {
  X,
  Star,
  Calendar,
  MapPin,
  Clock,
  FileText,
  User,
  CreditCard,
  Hash,
  CheckCircle,
  XCircle,
  Timer,
  AlertCircle,
} from "lucide-react";

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: <CheckCircle className="w-5 h-5" />,
          badgeBg: "bg-green-100",
        };
      case "pending":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
          icon: <Timer className="w-5 h-5" />,
          badgeBg: "bg-yellow-100",
        };
      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: <XCircle className="w-5 h-5" />,
          badgeBg: "bg-red-100",
        };
      case "completed":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: <CheckCircle className="w-5 h-5" />,
          badgeBg: "bg-blue-100",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: <AlertCircle className="w-5 h-5" />,
          badgeBg: "bg-gray-100",
        };
    }
  };

  // Calculate days
  const appointmentDate: Date = new Date(appointment.date);
  const bookingDate: Date = new Date(appointment.bookingDate);
  const today: Date = new Date();

  const totalDays: number = Math.ceil(
    (appointmentDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysLeft: number = Math.ceil(
    (appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const statusConfig = getStatusConfig(appointment.status);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:ml-[250px]">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Appointment Details
                  </h2>
                  <p className="text-sm text-blue-100">
                    Complete information about your appointment
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {/* Doctor Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl p-5 mb-6 shadow-sm">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                    {appointment.doctor.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {appointment.doctor.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 font-medium mb-2">
                      {appointment.doctor.specialty}
                    </p>
                    {appointment.doctor.rating && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-700">
                          {appointment.doctor.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${statusConfig.border} ${statusConfig.text} ${statusConfig.badgeBg} flex items-center gap-2 shadow-sm`}
                >
                  {statusConfig.icon}
                  <span>
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              {/* Appointment Information */}
              <div className="bg-white border-2 border-blue-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-blue-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">
                    Appointment Information
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Type:
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {appointment.consultationType}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Date & Time:
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <p className="font-bold text-gray-900 text-sm">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Location:
                    </p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="font-bold text-gray-900 text-sm">
                        {appointment.location}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg shadow-md">
                    <p className="text-xs font-semibold text-blue-100 mb-1">
                      Service Fee:
                    </p>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-white" />
                      <p className="font-bold text-white text-xl">
                        {formatCurrency(appointment.fee)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div className="bg-white border-2 border-blue-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-blue-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">
                    Patient Information
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Patient Name:
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {appointment.patientName}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Booking Date:
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {appointment.bookingDate}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Appointment ID:
                    </p>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-blue-600" />
                      <p className="font-bold text-gray-900 text-sm font-mono">
                        {appointment.appointmentId}
                      </p>
                    </div>
                  </div>

                  {/* Days Information */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Duration:
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <p className="font-bold text-gray-900 text-sm">
                        {totalDays} {totalDays === 1 ? "day" : "days"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border-2 border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Status:
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <p
                        className={`font-bold text-sm px-3 py-1 rounded-full ${
                          daysLeft < 0
                            ? "bg-red-100 text-red-700"
                            : daysLeft === 0
                            ? "bg-orange-100 text-orange-700"
                            : daysLeft <= 3
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
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
              <div className="mb-5">
                <div className="bg-white border-2 border-blue-100 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-blue-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base">
                      Symptoms/Reason for Visit
                    </h4>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {appointment.symptomsReason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {appointment.additionalNotes && (
              <div className="mb-5">
                <div className="bg-white border-2 border-blue-100 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-blue-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base">
                      Additional Notes
                    </h4>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {appointment.additionalNotes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {appointment.status === "rejected" &&
              appointment.rejectionReason && (
                <div className="mb-5">
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-red-800 mb-2 text-base">
                          Reason for Rejection
                        </h4>
                        <p className="text-red-700 text-sm leading-relaxed">
                          {appointment.rejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-blue-100 bg-gray-50 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-all shadow-sm"
              >
                Close
              </button>
              {(appointment.status === "accepted" ||
                appointment.status === "pending") && (
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Reschedule Appointment
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
