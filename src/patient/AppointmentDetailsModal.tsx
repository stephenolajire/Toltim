import {
  X,
  Star,
  Calendar,
  MapPin,
  Clock,
  User,
  CreditCard,
  Hash,
  CheckCircle,
  XCircle,
  Timer,
  AlertCircle,
  Stethoscope,
  CalendarCheck,
  UserCircle,
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
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
        };
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: <Timer className="w-5 h-5" />,
          badgeBg: "bg-amber-100",
          gradient: "from-amber-500 to-amber-600",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
        };
      case "rejected":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          icon: <XCircle className="w-5 h-5" />,
          badgeBg: "bg-rose-100",
          gradient: "from-rose-500 to-rose-600",
          iconBg: "bg-rose-100",
          iconColor: "text-rose-600",
        };
      case "completed":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: <CheckCircle className="w-5 h-5" />,
          badgeBg: "bg-blue-100",
          gradient: "from-blue-500 to-blue-600",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: <AlertCircle className="w-5 h-5" />,
          badgeBg: "bg-slate-100",
          gradient: "from-slate-500 to-slate-600",
          iconBg: "bg-slate-100",
          iconColor: "text-slate-600",
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
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">
                  Appointment Details
                </h2>
                <p className="text-white/90 text-sm">
                  {appointment.consultationType || "Healthcare Service"}
                </p>
              </div>
              <div
                className={`px-3 py-1.5 rounded-lg ${statusConfig.badgeBg} ${statusConfig.text} font-semibold text-sm flex items-center gap-2 border ${statusConfig.border}`}
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

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Healthcare Provider Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Healthcare Provider
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                  {appointment.doctor?.avatar ||
                    appointment.performedBy?.charAt(0) ||
                    "N"}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-0.5">
                    {appointment.doctor?.name ||
                      appointment.performedBy ||
                      "Healthcare Provider"}
                  </h4>
                  <p className="text-gray-600 text-sm font-medium">
                    {appointment.doctor?.specialty || "Nursing Procedure"}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Appointment Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" />
                  Appointment Information
                </h3>

                <div className="space-y-3">
                  {/* Date */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${statusConfig.iconBg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Calendar
                          className={`w-5 h-5 ${statusConfig.iconColor}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Appointment Date
                        </p>
                        <p className="font-semibold text-gray-900 text-sm">
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
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Time
                          </p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-green-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Location
                        </p>
                        <p className="font-semibold text-gray-900 text-sm break-words">
                          {appointment.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-white/80 uppercase tracking-wide mb-1">
                          Service Fee
                        </p>
                        <p className="font-bold text-white text-lg">
                          {formatCurrency(appointment.fee || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Booking Information
                </h3>

                <div className="space-y-3">
                  {/* Booking ID */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Hash className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Booking ID
                        </p>
                        <p className="font-mono font-semibold text-gray-900 text-xs break-all">
                          {appointment.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Days Left */}
                  {daysLeft !== null && (
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors">
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
                            className={`font-semibold text-sm ${
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
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-green-300 transition-colors">
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
                          <p className="font-semibold text-gray-900 text-sm">
                            {appointment.metadata.reviewed
                              ? "Reviewed"
                              : "Not Reviewed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Performed By */}
                  {appointment.performedBy && (
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Performed By
                          </p>
                          <p className="font-semibold text-gray-900 text-sm break-words">
                            {appointment.performedBy}
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
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-rose-900 mb-2 text-base">
                        Reason for Rejection
                      </h4>
                      <p className="text-rose-700 leading-relaxed text-sm">
                        {appointment.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-5">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-white hover:border-gray-400 transition-all text-sm"
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
