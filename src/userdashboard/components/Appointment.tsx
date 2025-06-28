import { Calendar } from "lucide-react";
import React from "react";
import AppointmentCard from "./AppointmentCard";

const AppointmentData = [
  {
    id: 1,
    statue: "confirmed",
    location: "Abuja",
    name: "John Does",
    time: "27-05-2025 02:00pm",
  },
  {
    id: 2,
    statue: "pending",
    location: "Lagos",
    name: "John Doe",
    time: "27-05-2025 02:00pm",
  },
  {
    id: 3,
    statue: "cancelled",
    location: "Ibadan",
    name: "John Doe",
    time: "27-05-2025 02:00pm",
  },
];

const Appointment: React.FC = () => {
  return (
    <div className="h-auto w-full pb-1 md:pb-10 rounded-lg">
      <div className="flex flex-col space-y-2 text-gray-200 bg-gradient-to-bl from-purple-500 to-blue-500 w-full py-6 px-4 rounded-t-lg">
        <div className="flex space-x-4 items-center">
          <Calendar className="text-lg lg:text-xl" />
          <h3 className="text-lg lg:text-xl font-bold">Upcoming Appointment</h3>
        </div>
        <p className="text-base text-gray-200">Manage your scheduled visits</p>
      </div>
      <div className="space-y-4">
        <div className="bg-white px-6 pt-6 pb-3">
          {AppointmentData.map((data) => (
            <AppointmentCard
              key={data.id}
              location={data.location}
              statue={data.statue}
              name={data.name}
              time={data.time}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
