import React from "react";
import {Stethoscope, Heart, Bed } from "lucide-react";
import { NavLink } from "react-router-dom";

const BookingNavigation: React.FC = () => {
  const userNav = [
    {
      id: 1,
      href: "/admin/bookings",
      name: "Procedures",
      icon: <Stethoscope size={18} />,
    },
    {
      id: 2,
      href: "/admin/bookings/caregiver",
      name: "Caregiver",
      icon: <Heart size={18} />,
    },
    {
      id: 3,
      href: "/admin/bookings/bedside",
      name: "Bedside",
      icon: <Bed size={18} />,
    },
  ];
  return (
    <div className="Py-10 flex space-x-5 bg-gray-100 items-center justify-center p-1">
      {userNav.map((nav) => (
        <div key={nav.id} className="w-full flex items-center justify-center">
          <NavLink
            to={nav.href}
            className={({ isActive }) =>
              isActive
                ? "bg-white text-green-600 py-1 flex space-x-3 w-full items-center justify-center"
                : "text-black flex items-center space-x-3"
            }
          >
            <span>{nav.icon}</span>
            <span>{nav.name}</span>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default BookingNavigation;
