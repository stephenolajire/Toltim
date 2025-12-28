import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import api from "../../constant/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Props {
  booking_id: string;
  onClose: (v: boolean) => void;
}

const RecordCareTreatmentModal: React.FC<Props> = ({ booking_id, onClose }) => {
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (payload: { notes: string; date: string }) =>
      api.post(`/caregiver-booking/session-record/${booking_id}/`, payload),
    onSuccess: () => {
      toast.success("Session recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["nurse-bookings"] });
      const role = localStorage.getItem("role");
      if (role === "nurse") {
        navigate("/nurse/caregiver");
      } else {
        navigate("/chw/caregiver");
      }
      onClose(false);
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Failed to record session";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      toast.error("Please enter notes");
      return;
    }

    mutation.mutate({ notes, date });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full relative">
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Record Treatment
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Add session notes and date.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-700 font-medium block mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-xs text-gray-700 font-medium block mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Enter treatment notes..."
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {mutation.isPending ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordCareTreatmentModal;
