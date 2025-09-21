import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../constant/api";

interface Procedure {
  id: number;
  procedure_id: string;
  title: string;
  description: string;
  duration: string;
  repeated_visits: boolean;
  price: string;
  icon_url: string;
  status: string;
  inclusions?: Array<{ id: number; item: string }>;
  requirements?: Array<{ id: number; item: string }>;
  created_at?: string;
  updated_at?: string;
}

interface ProcedureItem {
  procedure: Procedure;
  procedure_id: number;
  num_days: number;
  subtotal: string;
}

interface PatientDetail {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  relationship_to_patient: string;
}

interface BookingDetails {
  id: number;
  booking_id: string;
  user: string;
  nurse: string;
  nurse_full_name?: string;
  scheduling_option: string;
  start_date: string;
  time_of_day: string;
  selected_days: string[];
  service_dates: string;
  is_for_self: boolean;
  status: "pending" | "assigned" | "active" | "completed";
  total_amount: string;
  procedure_item: ProcedureItem;
  patient_detail: PatientDetail;
  service_address: string;
  service_location: string;
  created_at: string;
  updated_at: string;
}

interface BookingDetailsModalProps {
  bookingId: number;
  isOpen: boolean;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  bookingId,
  isOpen,
  onClose,
}) => {
  // Fetch booking details
  const {
    data: bookingDetails,
    isLoading,
    isError,
  } = useQuery<BookingDetails>({
    queryKey: ["booking-details", bookingId],
    queryFn: async () => {
      const res = await api.get(
        `services/nurse-procedure-bookings/${bookingId}`
      );
      console.log("Fetched booking details:", res.data);
      return res.data;
    },
    enabled: isOpen && !!bookingId,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      assigned: "bg-blue-100 text-blue-800 border-blue-200",
      active: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          statusColors[status as keyof typeof statusColors] ||
          statusColors.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-200">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
        //   className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Booking Details
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {bookingDetails?.booking_id || `Booking #${bookingId}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-500">Loading booking details...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">Failed to load booking details</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : bookingDetails ? (
            <div className="space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Booking Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(bookingDetails.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">
                        {formatDate(bookingDetails.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-900">
                        {formatDate(bookingDetails.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Schedule Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="text-gray-900">
                        {formatDate(bookingDetails.start_date)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="text-gray-900">
                        {formatTime(bookingDetails.time_of_day)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schedule:</span>
                      <span className="text-gray-900 capitalize">
                        {bookingDetails.scheduling_option}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">
                  Patient Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600 text-sm">Full Name:</span>
                      <p className="text-gray-900 font-medium">
                        {bookingDetails.patient_detail ?.first_name}{" "}
                        {bookingDetails.patient_detail?.last_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Email:</span>
                      <p className="text-gray-900">
                        {bookingDetails.patient_detail?.email}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Phone:</span>
                      <p className="text-gray-900">
                        {bookingDetails.patient_detail?.phone_number}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600 text-sm">
                        Relationship:
                      </span>
                      <p className="text-gray-900">
                        {bookingDetails.patient_detail?.relationship_to_patient}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Is for Self:
                      </span>
                      <p className="text-gray-900">
                        {bookingDetails.is_for_self ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Address:</span>
                      <p className="text-gray-900">
                        {bookingDetails.patient_detail?.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Procedure Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">
                  Procedure Details
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    {bookingDetails.procedure_item.procedure.icon_url && (
                      <img
                        src={bookingDetails.procedure_item.procedure.icon_url}
                        alt="Procedure icon"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        {bookingDetails.procedure_item.procedure.title}
                      </h5>
                      <p className="text-gray-600 text-sm mt-1">
                        {bookingDetails.procedure_item.procedure.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="text-gray-900">
                          {bookingDetails.procedure_item.procedure.duration}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Days:</span>
                        <span className="text-gray-900">
                          {bookingDetails.procedure_item.num_days}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repeated Visits:</span>
                        <span className="text-gray-900">
                          {bookingDetails.procedure_item.procedure
                            .repeated_visits
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="text-gray-900">
                          ₦{bookingDetails.procedure_item.procedure.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-900">
                          ₦{bookingDetails.procedure_item.subtotal}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-900">Total Amount:</span>
                        <span className="text-gray-900">
                          ₦{bookingDetails.total_amount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Inclusions */}
                  {bookingDetails.procedure_item.procedure.inclusions &&
                    bookingDetails.procedure_item.procedure.inclusions.length >
                      0 && (
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">
                          Inclusions:
                        </h6>
                        <ul className="list-disc list-inside space-y-1">
                          {bookingDetails.procedure_item.procedure.inclusions.map(
                            (inclusion) => (
                              <li
                                key={inclusion.id}
                                className="text-gray-600 text-sm"
                              >
                                {inclusion.item}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Requirements */}
                  {bookingDetails.procedure_item.procedure.requirements &&
                    bookingDetails.procedure_item.procedure.requirements
                      .length > 0 && (
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">
                          Requirements:
                        </h6>
                        <ul className="list-disc list-inside space-y-1">
                          {bookingDetails.procedure_item.procedure.requirements.map(
                            (requirement) => (
                              <li
                                key={requirement.id}
                                className="text-gray-600 text-sm"
                              >
                                {requirement.item}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>

              {/* Service Location */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">
                  Service Location
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600 text-sm">Location:</span>
                    <p className="text-gray-900">
                      {bookingDetails.service_location}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Address:</span>
                    <p className="text-gray-900">
                      {bookingDetails.service_address}
                    </p>
                  </div>
                  {bookingDetails.selected_days ?.length > 0 && (
                    <div>
                      <span className="text-gray-600 text-sm">
                        Selected Days:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {bookingDetails.selected_days.map((day) => (
                          <span
                            key={day}
                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Nurse Assignment */}
              {bookingDetails.nurse_full_name && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Assigned Nurse
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nurse:</span>
                    <span className="text-gray-900 font-medium">
                      {bookingDetails.nurse_full_name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {bookingDetails && (
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Edit Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
