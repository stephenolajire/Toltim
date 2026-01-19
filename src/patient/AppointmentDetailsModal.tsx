import {
  X,
  Star,
  Calendar,
  MapPin,
  Clock,
  // FileText,
  User,
  CreditCard,
  Hash,
  CheckCircle,
  XCircle,
  Timer,
  AlertCircle,
  Stethoscope,
  CalendarCheck,
} from "lucide-react";

interface AppointmentDetailsModalProps {
  appointment: any;
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
      case "started":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: <CheckCircle className="w-5 h-5" />,
          badgeBg: "bg-emerald-100",
          gradient: "from-emerald-500 to-emerald-600",
        };
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: <Timer className="w-5 h-5" />,
          badgeBg: "bg-amber-100",
          gradient: "from-amber-500 to-amber-600",
        };
      case "rejected":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          icon: <XCircle className="w-5 h-5" />,
          badgeBg: "bg-rose-100",
          gradient: "from-rose-500 to-rose-600",
        };
      case "completed":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: <CheckCircle className="w-5 h-5" />,
          badgeBg: "bg-blue-100",
          gradient: "from-blue-500 to-blue-600",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: <AlertCircle className="w-5 h-5" />,
          badgeBg: "bg-slate-100",
          gradient: "from-slate-500 to-slate-600",
        };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const calculateDaysLeft = () => {
    if (!appointment.metadata?.start_date) return null;

    const startDate = new Date(appointment.metadata.start_date);
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const daysLeft = calculateDaysLeft();
  const statusConfig = getStatusConfig(
    appointment.status || appointment.metadata?.status,
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header - Gradient with better styling */}
          <div
            className={`relative bg-gradient-to-br ${statusConfig.gradient} p-6`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 shadow-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  Appointment Details
                </h2>
                <p className="text-white/90 text-sm">
                  {appointment.consultationType || "Healthcare Service"}
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-xl ${statusConfig.badgeBg} ${statusConfig.text} font-semibold text-sm flex items-center gap-2 border-2 ${statusConfig.border}`}
              >
                {statusConfig.icon}
                {(
                  appointment.status ||
                  appointment.metadata?.status ||
                  "pending"
                )
                  .charAt(0)
                  .toUpperCase() +
                  (
                    appointment.status ||
                    appointment.metadata?.status ||
                    "pending"
                  ).slice(1)}
              </div>
            </div>
          </div>

          {/* Content - Scrollable with better spacing */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Healthcare Provider Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center text-white font-bold text-3xl shadow-lg`}
                >
                  {appointment.doctor?.avatar ||
                    appointment.performedBy?.charAt(0) ||
                    "N"}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {appointment.doctor?.name ||
                      appointment.performedBy ||
                      "Healthcare Provider"}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {appointment.doctor?.specialty || "Nursing Procedure"}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Appointment Information */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-blue-600" />
                  Appointment Information
                </h4>

                <div className="space-y-3">
                  {/* Date */}
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Appointment Date
                        </p>
                        <p className="font-bold text-gray-900">
                          {formatDate(
                            appointment.metadata?.start_date ||
                              appointment.date,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  {appointment.time && appointment.time !== "N/A" && (
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Time
                          </p>
                          <p className="font-bold text-gray-900">
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Location
                        </p>
                        <p className="font-bold text-gray-900 break-words">
                          {appointment.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fee */}
                  <div
                    className={`rounded-xl p-4 bg-gradient-to-br ${statusConfig.gradient} shadow-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-white/80 uppercase tracking-wide mb-1">
                          Service Fee
                        </p>
                        <p className="font-bold text-white text-xl">
                          {formatCurrency(appointment.fee || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Booking Information
                </h4>

                <div className="space-y-3">
                  {/* Booking ID */}
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Hash className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Booking ID
                        </p>
                        <p className="font-mono font-bold text-gray-900 text-sm break-all">
                          {appointment.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Days Left */}
                  {daysLeft !== null && (
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            daysLeft < 0
                              ? "bg-red-100"
                              : daysLeft === 0
                                ? "bg-orange-100"
                                : daysLeft <= 3
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                          }`}
                        >
                          <Clock
                            className={`w-5 h-5 ${
                              daysLeft < 0
                                ? "text-red-600"
                                : daysLeft === 0
                                  ? "text-orange-600"
                                  : daysLeft <= 3
                                    ? "text-yellow-600"
                                    : "text-green-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Time Status
                          </p>
                          <p
                            className={`font-bold text-sm ${
                              daysLeft < 0
                                ? "text-red-700"
                                : daysLeft === 0
                                  ? "text-orange-700"
                                  : daysLeft <= 3
                                    ? "text-yellow-700"
                                    : "text-green-700"
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
                  )}

                  {/* Reviewed Status */}
                  {appointment.metadata?.reviewed !== undefined && (
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            appointment.metadata.reviewed
                              ? "bg-green-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              appointment.metadata.reviewed
                                ? "text-green-600 fill-green-600"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Review Status
                          </p>
                          <p className="font-bold text-gray-900">
                            {appointment.metadata.reviewed
                              ? "Reviewed"
                              : "Not Reviewed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rejection Reason */}
            {(appointment.status === "rejected" ||
              appointment.metadata?.status === "rejected") &&
              appointment.rejectionReason && (
                <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-rose-900 mb-2 text-lg">
                        Reason for Rejection
                      </h4>
                      <p className="text-rose-700 leading-relaxed">
                        {appointment.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-white hover:border-gray-400 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentDetailsModal;
