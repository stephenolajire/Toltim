import { AlertTriangle, Clock, Eye } from "lucide-react";

const UnacceptedBookings = () => {
  const bookings = [
    {
      id: "BK001",
      patientName: "John Doe",
      service: "Blood Pressure Check",
      timeAgo: "2 hours ago",
      location: "Lagos",
    },
    {
      id: "BK002",
      patientName: "Jane Smith",
      service: "Wound Dressing",
      timeAgo: "4 hours ago",
      location: "Abuja",
    },
    {
      id: "BK003",
      patientName: "Mike Wilson",
      service: "Medication Admin",
      timeAgo: "6 hours ago",
      location: "Port Harcourt",
    },
  ];

//   const handleReassignNurse = () => {
    
//   };

  const handleViewMore = () => {
    console.log("View more bookings");
    
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-full">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Unaccepted Bookings
          </h2>
        </div>
        <p className=" text-gray-500">Bookings that need nurse assignment</p>
      </div>

      {/* Bookings List */}
      <div className="px-6 pb-4">
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-orange-50 rounded-lg p-4 border border-orange-100"
            >
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 items-center justify-between ">
                {/* Left side - Booking Info */}
                <div className="flex items-start gap-4">
                  <div className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded border">
                    {booking.id}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {booking.patientName}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      {booking.service}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>
                        {booking.timeAgo} • {booking.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Action Button */}
                <button
                  //   onClick={() => handleReassignNurse(booking.id)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Reassign Nurse
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - View More */}
      <div className="px-6 py-4 border-t border-gray-100">
        <button
          onClick={handleViewMore}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors mx-auto"
        >
          <Eye className="w-4 h-4" />
          View More
        </button>
      </div>
    </div>
  );
};

export default UnacceptedBookings;
