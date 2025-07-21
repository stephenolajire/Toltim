import React from "react";
import { Calendar, Clock, MapPin, User, Shield, Download, Share2, Printer } from "lucide-react";

interface ReceiptProps {
  appointmentDetails: {
    id: string;
    date: string;
    time: string;
    service: {
      name: string;
      price: number;
      duration: string;
    };
    practitioner: {
      name: string;
      title: string;
      location: string;
      profileImage: string;
    };
    patient: {
      name: string;
      email: string;
      phone: string;
      address: string;
      relationship?: string;
    };
    bookingDate: string;
    status: "confirmed" | "pending" | "cancelled";
  };
}

const appointmentDetails = {
  id: "APT-20250721-001",
  date: "2025-07-21",
  time: "10:00 AM",
  service: {
    name: "Wound Care & Dressing",
    price: 3500,
    duration: "30-45 minutes"
  },
  practitioner: {
    name: "Dr. Sarah Johnson",
    title: "Registered Nurse",
    location: "Victoria Island, Lagos",
    profileImage: "https://example.com/image.jpg"
  },
  patient: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 123 456 7890",
    address: "123 Main St, Lagos",
    relationship: "self"
  },
  bookingDate: "2025-07-20",
  status: "confirmed" as const
};

const AppointmentReceipt: React.FC<ReceiptProps> = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointment Confirmation</h1>
            <p className="text-green-600">Booking ID: {appointmentDetails.id}</p>
          </div>
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Booked on {formatDate(appointmentDetails.bookingDate)}</span>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="p-6 space-y-6">
        {/* Service & Provider */}
        <div className="flex items-start space-x-4">
          <img
            src={appointmentDetails.practitioner.profileImage}
            alt={appointmentDetails.practitioner.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {appointmentDetails.service.name}
            </h3>
            <p className="text-green-600">{appointmentDetails.practitioner.name}</p>
            <p className="text-sm text-gray-600">
              {appointmentDetails.practitioner.title}
            </p>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{appointmentDetails.practitioner.location}</span>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">
                {formatDate(appointmentDetails.date)}
              </p>
              <p className="text-sm text-gray-600">
                {appointmentDetails.time} ({appointmentDetails.service.duration})
              </p>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Patient Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{appointmentDetails.patient.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium">{appointmentDetails.patient.phone}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{appointmentDetails.patient.email}</p>
            </div>
            {appointmentDetails.patient.relationship && (
              <div>
                <p className="text-gray-600">Relationship</p>
                <p className="font-medium capitalize">
                  {appointmentDetails.patient.relationship}
                </p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-gray-600">Address</p>
              <p className="font-medium">{appointmentDetails.patient.address}</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold text-gray-900">Total Amount</span>
            <span className="font-bold text-green-600">
              ₦{appointmentDetails.service.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="md:p-6 px-1 py-2 bg-gray-50 rounded-b-lg border-t">
        <div className="flex md:flex-row flex-col space-y- justify-between">
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
          <div
            className={`px-4 mt-3 md:mt-0 py-2 text-center rounded-lg text-sm font-medium ${
              appointmentDetails.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : appointmentDetails.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {appointmentDetails.status.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentReceipt;