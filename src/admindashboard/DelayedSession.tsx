import React from "react";

interface DelayedSession {
  id: string;
  patientName: string;
  originallyAssignedTo: string;
  scheduledDate: string;
  reason: string;
  status: "delayed";
}

const DelayedSessions: React.FC = () => {
  const delayedSessions: DelayedSession[] = [
    {
      id: "1",
      patientName: "John Smith",
      originallyAssignedTo: "Dr. Sarah Johnson",
      scheduledDate: "2024-06-23",
      reason: "Nurse unavailable due to emergency",
      status: "delayed",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="w-full pb-5 px-2 sm:px-4 md:px-8 lg:px-20 xl:px-50 bg-gray-100 mx-auto ">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 pt-5 mb-6 sm:mb-8">
        Delayed Sessions
      </h1>

      <div className="space-y-4 sm:space-y-6">
        {delayedSessions.map((session) => (
          <div
            key={session.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            {/* Orange left border indicator */}
            <div className="flex">
              <div className="w-1 bg-orange-500 flex-shrink-0"></div>
              <div className="flex-1 p-4 sm:p-6">
                {/* Mobile Layout */}
                <div className="block sm:hidden space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        {session.patientName}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          Originally assigned to: {session.originallyAssignedTo}
                        </p>
                        <p>Scheduled: {formatDate(session.scheduledDate)}</p>
                        <p>Reason: {session.reason}</p>
                      </div>
                    </div>
                    <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full font-medium ml-4">
                      Delayed
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                      Match New Nurse
                    </button>
                    <button className="flex-1 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                      Contact Patient
                    </button>
                  </div>
                </div>

                {/* Desktop/Tablet Layout */}
                <div className="hidden sm:block">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-2">
                            {session.patientName}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              Originally assigned to:{" "}
                              {session.originallyAssignedTo}
                            </p>
                            <p>
                              Scheduled: {formatDate(session.scheduledDate)}
                            </p>
                            <p>Reason: {session.reason}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-4 lg:gap-6 mt-4 lg:mt-0">
                          <span className="bg-red-100 text-red-800 px-3 py-1 text-sm rounded-full font-medium">
                            Delayed
                          </span>

                          <div className="flex gap-2">
                            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">
                              Match New Nurse
                            </button>
                            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap">
                              Contact Patient
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DelayedSessions;
