import React from "react";
import { NavLink } from "react-router-dom";

const HistoryNavigation: React.FC = () => {
  const userNav = [
    {
      id: 1,
      href: "/patient/history",
      name: "Appointment History",
    },
    {
      id: 2,
      href: "/patient/history/transaction",
      name: "Transaction History",
    },

  ];
  return (
    <div className="Py-10 flex space-x-5 bg-gray-100 items-center justify-center p-2.5">
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
            <span>{nav.name}</span>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default HistoryNavigation;
