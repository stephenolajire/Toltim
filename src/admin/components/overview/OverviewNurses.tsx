import { Star, User } from "lucide-react";

const TopPerformingNurses = () => {
  const nurses = [
    {
      name: "Sarah Johnson",
      specialty: "General Care",
      rating: 4.9,
      bookings: 45,
    },
    {
      name: "Michael Chen",
      specialty: "Wound Care",
      rating: 4.8,
      bookings: 38,
    },
    {
      name: "Emily Rodriguez",
      specialty: "Diabetes Care",
      rating: 4.7,
      bookings: 42,
    },
    {
      name: "David Kim",
      specialty: "Elderly Care",
      rating: 4.6,
      bookings: 35,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-5 h-5 text-green-500 fill-current" />
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Top Performing Nurses
        </h2>
      </div>

      <p className=" text-gray-500 mb-6">
        Highest rated nurses this month
      </p>

      {/* Nurses List */}
      <div className="space-y-4">
        {nurses.map((nurse, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Left side - Avatar and Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{nurse.name}</h3>
                <p className="text-sm text-gray-500">{nurse.specialty}</p>
              </div>
            </div>

            {/* Right side - Rating and Bookings */}
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium text-gray-900">
                  {nurse.rating}
                </span>
              </div>
              <p className="text-sm text-gray-500">{nurse.bookings} bookings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformingNurses;
