import { Clock4, MapPin } from "lucide-react";
import React from "react";

interface AppointmentCardProps {
  time: string;
  statue: string;
  name: string;
  location: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  time,
  statue,
  name,
  location,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="border border-gray-300 p-3 bg-gray-100 w-full h-auto rounded-lg mb-3 last-child">
      <div className="w-full h-auto flex justify-between items-center mb-2">
        <p className="text-gray-900 font-semibold">{name}</p>
        <div
          className={`${getStatusColor(
            statue
          )} py-0.5 px-3 rounded-full flex items-center justify-center text-sm`}
        >
          {statue}
        </div>
      </div>
      <div className="flex space-x-3 items-center mb-2">
        <Clock4 className="text-gray-500" height={16} width={16} />
        <span className="text-gray-500 text-sm">{time}</span>
      </div>
      <div className="flex space-x-3 items-center">
        <MapPin className="text-gray-500" height={16} width={16} />
        <span className="text-gray-500 text-sm ">{location}</span>
      </div>
    </div>
  );
};

export default AppointmentCard;
