import React, { useState } from "react";
import { Download, Play, X, Eye } from "lucide-react";
import RecordTreatmentModal from "../components/RecordModal";
import { useNurseActiveBooking } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import PatientConfirmation from "../components/PatientConfirmation";
import type { BookingData } from "../../types/bookingdata";
import api from "../../constant/api";
import { toast } from "react-toastify";

interface ActiveBookingResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BookingData[];
}

const ActivePatients: React.FC = () => {
  const {
    data: activeBooking,
    isLoading,
    error,
  } = useNurseActiveBooking() as {
    data: ActiveBookingResponse | undefined;
    isLoading: boolean;
    error: any;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isViewAssessmentOpen, setIsViewAssessmentOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null,
  );
  const [dateError, setDateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper: Check if today is a scheduled service date
  const canRecordSession = (booking: BookingData): boolean => {
    const today = new Date().toISOString().split("T")[0];
    return booking.service_dates.includes(today);
  };

  // Helper: Get session statistics
  const getSessionStats = (booking: BookingData) => {
    const totalSessions = booking.service_dates.length;
    const today = new Date().toISOString().split("T")[0];

    // Count completed sessions (dates before today)
    const completedSessions = booking.service_dates.filter(
      (date) => date < today,
    ).length;

    return {
      completed: completedSessions,
      total: totalSessions,
      percentage: (completedSessions / totalSessions) * 100,
    };
  };

  console.log(activeBooking);

  // Handle OTP submission from PatientConfirmation modal
  const handleOTPSubmit = async (otp: string) => {
    if (!selectedBooking) return;

    setIsSubmitting(true);

    try {
      const id = selectedBooking.id;
      const today = new Date().toISOString().split("T")[0];

      // Validate that today is a scheduled service date
      if (!selectedBooking.service_dates.includes(today)) {
        setDateError("Today is not a scheduled service date for this patient.");
        setIsSubmitting(false);
        toast.error("Today is not a scheduled service date.");
        return;
      }

      console.log("Verifying OTP for Booking:", id);
      console.log("Service Date:", today);
      console.log("OTP:", otp);

      const response = await api.post(
        `services/nurse-procedure-bookings/${id}/verify-code/`,
        {
          verification_code: otp,
        },
      );

      if (response.status === 200) {
        // OTP verified successfully
        setIsConfirmationOpen(false);
        setDateError("");
        setIsSubmitting(false);
        setIsOpen(true); // Open the Record Treatment Modal
        toast.success("OTP verified successfully!");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);

      // Handle specific error responses
      if (error.response?.status === 400) {
        setDateError("Invalid OTP. Please check and try again.");
        toast.error("Invalid OTP. Please check and try again.");
      } else if (error.response?.data?.errors) {
        setDateError(`Verification failed: ${error.response.data.errors}`);
        toast.error(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setDateError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setDateError("Failed to verify OTP. Please try again.");
        toast.error("Failed to verify OTP. Please try again.");
      }

      setIsSubmitting(false);
    }
  };

  // Handle closing the confirmation modal
  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
    setSelectedBooking(null);
    setDateError("");
    setIsSubmitting(false);
  };

  // Open confirmation modal
  const openConfirmation = (booking: BookingData) => {
    const today = new Date().toISOString().split("T")[0];

    // Pre-validate that today is a service date
    if (!booking.service_dates.includes(today)) {
      toast.error(
        `Today is not a scheduled service date. Next session: ${getNextSession(
          booking.service_dates,
          booking.time_of_day,
        )}`,
      );
      console.log("Validation Failed:");
      console.log("Today:", today);
      console.log("Service dates:", booking.service_dates);
      return;
    }

    setSelectedBooking(booking);
    setIsConfirmationOpen(true);
    setDateError("");
  };

  // Open view assessment modal
  const openViewAssessment = (booking: BookingData) => {
    setSelectedBooking(booking);
    setIsViewAssessmentOpen(true);
  };

  // Open test results - directly open image in new tab
  const openTestResults = (booking: BookingData) => {
    if (booking.test_result) {
      const imageUrl = `${api.defaults.baseURL}${booking.test_result}`;
      window.open(imageUrl, "_blank");
    } else {
      toast.info("No test results available for this patient.");
    }
  };

  // Toggle record modal
  const openModal = () => {
    setIsOpen(!isOpen);
  };

  // View Assessment Modal Component
  const ViewAssessmentModal = () => {
    if (!selectedBooking) return null;

    const handleClose = () => {
      setIsViewAssessmentOpen(false);
      setSelectedBooking(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Patient Assessment Details
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Patient Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Patient Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-sm text-gray-600 break-words">
                    {selectedBooking.patient_detail.first_name}{" "}
                    {selectedBooking.patient_detail.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-600 break-words">
                    {selectedBooking.patient_detail.phone_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600 break-words">
                    {selectedBooking.patient_detail.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Relationship
                  </p>
                  <p className="text-sm text-gray-600 break-words">
                    {selectedBooking.patient_detail.relationship_to_patient}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Booking Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Booking ID
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedBooking.booking_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedBooking.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Start Date
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedBooking.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Time</p>
                  <p className="text-sm text-gray-600">
                    {selectedBooking.time_of_day}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Schedule</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedBooking.scheduling_option}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Total Amount
                  </p>
                  <p className="text-sm text-gray-600">
                    ₦
                    {parseFloat(
                      selectedBooking.total_amount_display.toString(),
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Treatment Information */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Treatment Details
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Procedure</p>
                  <p className="text-sm text-gray-600">
                    {selectedBooking.procedure_item.procedure.title}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Description
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedBooking.procedure_item.procedure.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-sm text-gray-600">
                    {selectedBooking.procedure_item.procedure.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Number of Days
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedBooking.procedure_item.num_days} days
                  </p>
                </div>
              </div>
            </div>

            {/* Service Dates */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Service Dates
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedBooking.service_dates.map((date, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm"
                  >
                    {new Date(date).toLocaleDateString()}
                  </span>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            {selectedBooking.procedure_item.procedure.inclusions.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Inclusions
                </h4>
                <ul className="space-y-1">
                  {selectedBooking.procedure_item.procedure.inclusions.map(
                    (inclusion) => (
                      <li
                        key={inclusion.id}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                        {inclusion.item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {selectedBooking.procedure_item.procedure.requirements.length >
              0 && (
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Requirements
                </h4>
                <ul className="space-y-1">
                  {selectedBooking.procedure_item.procedure.requirements.map(
                    (requirement) => (
                      <li
                        key={requirement.id}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        {requirement.item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {/* Address */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Service Address
              </h4>
              <p className="text-sm text-gray-600">
                {selectedBooking.service_address}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getNextSession = (
    serviceDates: string[],
    timeOfDay: string,
  ): string => {
    const today = new Date().toISOString().split("T")[0];
    const nextDate = serviceDates.find((date) => date >= today);

    if (!nextDate) return "No upcoming sessions";

    const date = new Date(nextDate);
    const isToday = nextDate === today;

    if (isToday) {
      return `Today, ${timeOfDay}`;
    } else {
      return `${date.toLocaleDateString()}, ${timeOfDay}`;
    }
  };

  const formatCurrency = (amount: string | number): string => {
    return `₦${parseFloat(amount.toString()).toLocaleString()}`;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  if (!activeBooking || activeBooking.results.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Active Patients
        </h2>
        <p className="text-gray-500 text-center py-8">
          No active patients found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-x-auto hide-scrollbar p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Active Patients
      </h2>

      <div className="space-y-6">
        {activeBooking.results.map((booking) => {
          const sessionStats = getSessionStats(booking);
          const canRecord = canRecordSession(booking);

          return (
            <div
              key={booking.id}
              className="border border-gray-100 rounded-lg p-5 bg-gray-50"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {booking.patient_detail.first_name}{" "}
                    {booking.patient_detail.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {booking.procedure_item.procedure.title} -{" "}
                    {booking.procedure_item.num_days} days
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Next Session:{" "}
                    {getNextSession(booking.service_dates, booking.time_of_day)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(booking.total_amount_display)}
                  </div>
                  <div className="text-sm text-gray-500">total amount</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>
                    {sessionStats.completed}/{sessionStats.total} sessions
                  </span>
                </div>
                <progress
                  className="w-full h-2 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-green-500 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-green-500 [&::-moz-progress-bar]:rounded-full"
                  value={sessionStats.completed}
                  max={sessionStats.total}
                ></progress>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  disabled={!canRecord}
                  onClick={() => {
                    const today = new Date().toISOString().split("T")[0];
                    console.log("=== Record Session Debug ===");
                    console.log("Today:", today);
                    console.log("Service dates:", booking.service_dates);
                    console.log("Can record?", canRecord);
                    console.log("Booking ID:", booking.id);
                    openConfirmation(booking);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !canRecord
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <Play className="w-4 h-4" />
                  {canRecord ? "Record Session" : "No Session Today"}
                </button>
                <button
                  onClick={() => openViewAssessment(booking)}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Assessment
                </button>
                <button
                  onClick={() => openTestResults(booking)}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Test Results
                </button>
              </div>
            </div>
          );
        })}

        {/* Render modals */}
        {isConfirmationOpen && (
          <PatientConfirmation
            isOpen={isConfirmationOpen}
            onClose={handleCloseConfirmation}
            onSubmit={handleOTPSubmit}
            dateError={dateError}
            isLoading={isSubmitting}
            bookingData={selectedBooking}
          />
        )}

        {isViewAssessmentOpen && <ViewAssessmentModal />}

        {isOpen && selectedBooking && (
          <RecordTreatmentModal
            isOpen={isOpen}
            onClose={openModal}
            bookingId={selectedBooking.id}
            bookingData={selectedBooking}
          />
        )}
      </div>
    </div>
  );
};

export default ActivePatients;
