import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  Stethoscope,
  Heart,
  UserCheck,
  User,
  Home,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  Plus,
  Minus,
  Filter,
  Search,
  Eye,
  Phone,
  MessageSquare,
} from "lucide-react";

// Types
interface Provider {
  id: string;
  name: string;
  type: "doctor" | "nurse" | "chw";
  specialty: string;
  rating: number;
  profileImage?: string;
  location: string;
}

interface Appointment {
  id: string;
  provider: Provider;
  type: "consultation" | "home-visit";
  date: string;
  time: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  patientName: string;
  symptoms: string;
  fee: number;
  bookingDate: string;
  notes?: string;
  rejectionReason?: string;
}

interface Transaction {
  id: string;
  type: "deposit" | "payment";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  description: string;
  appointmentId?: string;
  paymentMethod: "cash" | "mobile-money" | "bank-transfer";
  reference?: string;
}

// Mock Data
const mockAppointments: Appointment[] = [
  {
    id: "apt-001",
    provider: {
      id: "prov-001",
      name: "Dr. Sarah Johnson",
      type: "doctor",
      specialty: "Gynecologist",
      rating: 4.8,
      location: "Onitsha Main Market",
    },
    type: "consultation",
    date: "2025-07-25",
    time: "2:00 PM",
    status: "accepted",
    patientName: "Jane Doe",
    symptoms: "Regular checkup and consultation",
    fee: 8000,
    bookingDate: "2025-07-20",
    notes: "Bring previous test results",
  },
  {
    id: "apt-002",
    provider: {
      id: "prov-002",
      name: "Nurse Mary Okafor",
      type: "nurse",
      specialty: "General Care",
      rating: 4.6,
      location: "Onitsha Central Hospital",
    },
    type: "home-visit",
    date: "2025-07-22",
    time: "10:00 AM",
    status: "completed",
    patientName: "John Doe",
    symptoms: "Blood pressure monitoring and medication administration",
    fee: 12000,
    bookingDate: "2025-07-18",
  },
  {
    id: "apt-003",
    provider: {
      id: "prov-003",
      name: "CHW Peter Nwankwo",
      type: "chw",
      specialty: "Community Health",
      rating: 4.4,
      location: "Onitsha South",
    },
    type: "consultation",
    date: "2025-07-21",
    time: "9:00 AM",
    status: "rejected",
    patientName: "Jane Doe",
    symptoms: "Fever and headache",
    fee: 3000,
    bookingDate: "2025-07-19",
    rejectionReason: "Provider unavailable due to emergency",
  },
  {
    id: "apt-004",
    provider: {
      id: "prov-001",
      name: "Dr. Sarah Johnson",
      type: "doctor",
      specialty: "Gynecologist", 
      rating: 4.8,
      location: "Onitsha Main Market",
    },
    type: "consultation",
    date: "2025-07-19",
    time: "11:00 AM",
    status: "pending",
    patientName: "Jane Doe",
    symptoms: "Follow-up consultation",
    fee: 8000,
    bookingDate: "2025-07-18",
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    type: "deposit",
    amount: 50000,
    date: "2025-07-20",
    status: "completed",
    description: "Wallet deposit via mobile money",
    paymentMethod: "mobile-money",
    reference: "MM-2025072001234",
  },
  {
    id: "txn-002",
    type: "payment",
    amount: 8000,
    date: "2025-07-20",
    status: "completed",
    description: "Payment for appointment with Dr. Sarah Johnson",
    appointmentId: "apt-001",
    paymentMethod: "mobile-money",
    reference: "PAY-2025072001235",
  },
  {
    id: "txn-003",
    type: "payment",
    amount: 12000,
    date: "2025-07-22",
    status: "completed",
    description: "Payment for home visit with Nurse Mary Okafor",
    appointmentId: "apt-002",
    paymentMethod: "cash",
  },
  {
    id: "txn-004",
    type: "deposit",
    amount: 25000,
    date: "2025-07-18",
    status: "completed",
    description: "Wallet deposit via bank transfer",
    paymentMethod: "bank-transfer",
    reference: "BT-2025071801456",
  },
  {
    id: "txn-005",
    type: "payment",
    amount: 3000,
    date: "2025-07-21",
    status: "failed",
    description: "Payment for appointment with CHW Peter Nwankwo",
    appointmentId: "apt-003",
    paymentMethod: "mobile-money",
    reference: "PAY-2025072101456",
  },
];

const PatientHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"appointments" | "transactions">(
    "appointments"
  );
  const [appointmentFilter, setAppointmentFilter] = useState<
    "all" | "pending" | "accepted" | "rejected" | "completed" | "cancelled"
  >("all");
  const [transactionFilter, setTransactionFilter] = useState<
    "all" | "deposit" | "payment"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "doctor":
        return <Stethoscope className="w-5 h-5" />;
      case "nurse":
        return <Heart className="w-5 h-5" />;
      case "chw":
        return <UserCheck className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "doctor":
        return "bg-blue-100 text-blue-600";
      case "nurse":
        return "bg-green-100 text-green-600";
      case "chw":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
      case "cancelled":
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const matchesFilter =
      appointmentFilter === "all" || appointment.status === appointmentFilter;
    const matchesSearch =
      appointment.provider.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesFilter =
      transactionFilter === "all" || transaction.type === transactionFilter;
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderAppointmentCard = (appointment: Appointment) => (
    <div
      key={appointment.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(
              appointment.provider.type
            )}`}
          >
            {getTypeIcon(appointment.provider.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {appointment.provider.name}
            </h3>
            <p className="text-sm text-gray-600">
              {appointment.provider.specialty}
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(
            appointment.status
          )}`}
        >
          {getStatusIcon(appointment.status)}
          <span className="capitalize">{appointment.status}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {new Date(appointment.date).toLocaleDateString()} at{" "}
            {appointment.time}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>
            {appointment.type === "consultation"
              ? appointment.provider.location
              : "Home Visit"}
          </span>
        </div>
        {appointment.type === "home-visit" && (
          <div className="flex items-center text-sm text-gray-600">
            <Home className="w-4 h-4 mr-2" />
            <span>Home Visit</span>
          </div>
        )}
        {appointment.type === "consultation" && (
          <div className="flex items-center text-sm text-gray-600">
            <Building className="w-4 h-4 mr-2" />
            <span>In-Person Consultation</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-green-600">
          ₦{appointment.fee.toLocaleString()}
        </div>
        <button
          onClick={() => setSelectedAppointment(appointment)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
      </div>

      {appointment.rejectionReason && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            <span className="font-medium">Reason for rejection:</span>{" "}
            {appointment.rejectionReason}
          </p>
        </div>
      )}
    </div>
  );

  const renderTransactionCard = (transaction: Transaction) => (
    <div
      key={transaction.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              transaction.type === "deposit"
                ? "bg-green-100 text-green-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {transaction.type === "deposit" ? (
              <Plus className="w-5 h-5" />
            ) : (
              <Minus className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">
              {transaction.type}
            </h3>
            <p className="text-sm text-gray-600">{transaction.description}</p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(
            transaction.status
          )}`}
        >
          {getStatusIcon(transaction.status)}
          <span className="capitalize">{transaction.status}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(transaction.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CreditCard className="w-4 h-4 mr-2" />
          <span className="capitalize">
            {transaction.paymentMethod.replace("-", " ")}
          </span>
        </div>
        {transaction.reference && (
          <div className="text-xs text-gray-500">
            Ref: {transaction.reference}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`text-lg font-semibold ${
            transaction.type === "deposit" ? "text-green-600" : "text-blue-600"
          }`}
        >
          {transaction.type === "deposit" ? "+" : "-"}₦
          {transaction.amount.toLocaleString()}
        </div>
        <button
          onClick={() => setSelectedTransaction(transaction)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );

  const renderAppointmentModal = () => {
    if (!selectedAppointment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Appointment Details
              </h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Provider Info */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(
                    selectedAppointment.provider.type
                  )}`}
                >
                  {getTypeIcon(selectedAppointment.provider.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {selectedAppointment.provider.name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedAppointment.provider.specialty}
                  </p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {selectedAppointment.provider.rating}
                    </span>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(
                    selectedAppointment.status
                  )}`}
                >
                  {getStatusIcon(selectedAppointment.status)}
                  <span className="capitalize">
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Appointment Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <p className="font-medium">
                        {selectedAppointment.type === "consultation"
                          ? "In-Person Consultation"
                          : "Home Visit"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Date & Time:
                      </span>
                      <p className="font-medium">
                        {new Date(
                          selectedAppointment.date
                        ).toLocaleDateString()}{" "}
                        at {selectedAppointment.time}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Location:</span>
                      <p className="font-medium">
                        {selectedAppointment.type === "consultation"
                          ? selectedAppointment.provider.location
                          : "Home Visit"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Fee:</span>
                      <p className="font-medium text-green-600">
                        ₦{selectedAppointment.fee.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Patient Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">
                        Patient Name:
                      </span>
                      <p className="font-medium">
                        {selectedAppointment.patientName}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Booking Date:
                      </span>
                      <p className="font-medium">
                        {new Date(
                          selectedAppointment.bookingDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Appointment ID:
                      </span>
                      <p className="font-medium font-mono">
                        {selectedAppointment.id.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Symptoms/Reason for Visit
                </h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedAppointment.symptoms}
                </p>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Additional Notes
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}

              {selectedAppointment.rejectionReason && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Rejection Reason
                  </h4>
                  <p className="text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg">
                    {selectedAppointment.rejectionReason}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t">
                {selectedAppointment.status === "accepted" && (
                  <>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Call Provider</span>
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </>
                )}
                {selectedAppointment.status === "pending" && (
                  <button className="flex-1 border border-red-300 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-50">
                    Cancel Appointment
                  </button>
                )}
                {selectedAppointment.status === "rejected" && (
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium">
                    Book New Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTransactionModal = () => {
    if (!selectedTransaction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-lg w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Transaction Details
              </h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    selectedTransaction.type === "deposit"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {selectedTransaction.type === "deposit" ? (
                    <Plus className="w-8 h-8" />
                  ) : (
                    <Minus className="w-8 h-8" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedTransaction.type === "deposit" ? "+" : "-"}₦
                  {selectedTransaction.amount.toLocaleString()}
                </h3>
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border items-center space-x-1 ${getStatusColor(
                    selectedTransaction.status
                  )}`}
                >
                  {getStatusIcon(selectedTransaction.status)}
                  <span className="capitalize">
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <span className="text-sm text-gray-600">
                    Transaction Type:
                  </span>
                  <p className="font-medium capitalize">
                    {selectedTransaction.type}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Description:</span>
                  <p className="font-medium">
                    {selectedTransaction.description}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date:</span>
                  <p className="font-medium">
                    {new Date(selectedTransaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <p className="font-medium capitalize">
                    {selectedTransaction.paymentMethod.replace("-", " ")}
                  </p>
                </div>
                {selectedTransaction.reference && (
                  <div>
                    <span className="text-sm text-gray-600">Reference:</span>
                    <p className="font-medium font-mono">
                      {selectedTransaction.reference}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">Transaction ID:</span>
                  <p className="font-medium font-mono">
                    {selectedTransaction.id.toUpperCase()}
                  </p>
                </div>
              </div>

              {selectedTransaction.status === "failed" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">
                    This transaction failed. If you were charged, the amount
                    will be refunded within 3-5 business days.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => window.history.back()}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">History</h1>
            <p className="text-gray-600">
              View your appointments and transactions
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === "appointments"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === "transactions"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Transactions
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={
                activeTab === "appointments"
                  ? appointmentFilter
                  : transactionFilter
              }
              onChange={(e) => {
                if (activeTab === "appointments") {
                  setAppointmentFilter(e.target.value as any);
                } else {
                  setTransactionFilter(e.target.value as any);
                }
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {activeTab === "appointments" ? (
                <>
                  <option value="all">All Appointments</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="all">All Transactions</option>
                  <option value="deposit">Deposits</option>
                  <option value="payment">Payments</option>
                </>
              )}
            </select>
            <Filter className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content */}
      {/* Content */}
      <div className="space-y-4">
        {activeTab === "appointments" ? (
          filteredAppointments.length > 0 ? (
            filteredAppointments.map(renderAppointmentCard)
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No appointments found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map(renderTransactionCard)
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No transactions found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Render Modals */}
      {renderAppointmentModal()}
      {renderTransactionModal()}
    </div>
  );
};

export default PatientHistory;