import React, { useState } from "react";
import { Calendar, Download, Play, X } from "lucide-react";
import RecordTreatmentModal from "../components/RecordModal";

interface Patient {
  id: string;
  name: string;
  treatment: string;
  nextSession: string;
  progress: {
    current: number;
    total: number;
  };
  earnings: number;
}

const ActivePatients: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const PatientConfirmation = () => {
    const handleSubmit = () => {
      console.log("Session recorded with value:", inputValue);
      // Add your logic here to handle the session recording
      setIsConfirmationOpen(false); // Close confirmation after submit
      setInputValue(""); // Reset input
      setIsOpen(true); // Open the Record Treatment Modal after confirmation
    };

    const handleClose = () => {
      setIsConfirmationOpen(false);
      setInputValue(""); // Reset input when closing
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-[400px] bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Enter Confirmation Code
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full">
            <form className="w-full" onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label
                  htmlFor="sessionValue"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Session Value
                </label>
                <input
                  id="sessionValue"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter confirmation code"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Submit
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const patients: Patient[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      treatment: "Daily wound dressing for 7 days",
      nextSession: "Today, 2:00 PM",
      progress: { current: 3, total: 7 },
      earnings: 24000,
    },
    {
      id: "2",
      name: "Michael Adebayo",
      treatment: "Twice weekly diabetes monitoring",
      nextSession: "Tomorrow, 10:00 AM",
      progress: { current: 1, total: 4 },
      earnings: 10000,
    },
  ];

  const getProgressPercentage = (current: number, total: number): number => {
    return (current / total) * 100;
  };

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString()}`;
  };

  const openModal = () => {
    setIsOpen(!isOpen);
  };

  const openConfirmation = () => {
    setIsConfirmationOpen(!isConfirmationOpen);
  };

  return (
    <div className="bg-white rounded-lg overflow-x-auto hide-scrollbar">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Active Patients
      </h2>

      <div className="space-y-6">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="border border-gray-100 rounded-lg p-5 bg-gray-50"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {patient.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {patient.treatment}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Next Session: {patient.nextSession}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(patient.earnings)}
                </div>
                <div className="text-sm text-gray-500">earned so far</div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm text-gray-600">
                  {patient.progress.current}/{patient.progress.total} sessions
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${getProgressPercentage(
                      patient.progress.current,
                      patient.progress.total
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={openConfirmation}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                Record Session
              </button>
              <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <Calendar className="w-4 h-4" />
                View Assessment
              </button>
              <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <Download className="w-4 h-4" />
                Test Results
              </button>
            </div>
          </div>
        ))}

        {/* Render modals */}
        {isConfirmationOpen && <PatientConfirmation />}

        {/* Uncomment when you have the RecordTreatmentModal component */}
        {isOpen && <RecordTreatmentModal isOpen={isOpen} onClose={openModal} />}
      </div>
    </div>
  );
};

export default ActivePatients;
