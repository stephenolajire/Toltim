import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Home,
  Shield,
  Stethoscope,
  User,
  Wallet,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

interface SidebarProp {
  close: () => void;
}

const adminLinks = [
  {
    name: "overview",
    href: "/admin",
    icon: <Home size={16} />,
  },
  {
    name: "bookings",
    href: "/admin/bookings",
    icon: <Calendar size={16} />,
  },
  {
    name: "users",
    href: "/admin/users",
    icon: <User size={16} />,
  },
  {
    name: "payments",
    href: "/admin/payment",
    icon: <Wallet size={16} />,
  },
  {
    name: "verifications",
    href: "/admin/verifications",
    icon: <Shield size={16} />,
  },
];

const procedureSubLinks = [
  {
    name: "nursing procedure",
    href: "/admin/nurse/procedures",
  },
  {
    name: "chw procedure",
    href: "/admin/chw/procedures",
  },
  {
    name: "in-bed procedure",
    href: "/admin/in-bed/procedures/",
  },
];

const Sidebar: React.FC<SidebarProp> = ({ close }) => {
  const [isProceduresOpen, setIsProceduresOpen] = useState(false);

  const toggleProcedures = () => {
    setIsProceduresOpen(!isProceduresOpen);
  };

  return (
    <div className="md:w-[220px] w-[300px] h-screen bg-gray-50 border border-l-0 border-t-0 border-b-0 border-r-gray-300 fixed p-4 rounded-tl-2xl rounded-bl-2xl flex flex-col justify-between">
      <div>
        <div className="flex space-x-3 items-center pb-10">
          <div>
            <Stethoscope className="text-green-500" />
          </div>
          <div>
            <h3 className="text-green-500 text-2xl font-bold">Toltim</h3>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 pb-5">Main Navigation</p>
          <ul className="flex flex-col space-y-5">
            {adminLinks.map((nav) => (
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-green-500 font-bold" : "text-gray-500"
                }
                key={nav.name}
                to={nav.href}
                onClick={close}
              >
                <li className="flex space-x-3 items-center">
                  <span className="text-xl">{nav.icon}</span>
                  <span>{nav.name}</span>
                </li>
              </NavLink>
            ))}

            {/* Procedures with dropdown */}
            <li>
              <div
                className="flex space-x-3 items-center text-gray-500 cursor-pointer hover:text-green-500 transition-colors"
                onClick={toggleProcedures}
              >
                <span className="text-xl">
                  <Stethoscope size={16} />
                </span>
                <span className="flex-1">procedures</span>
                <span className="text-sm">
                  {isProceduresOpen ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </span>
              </div>

              {/* Dropdown items */}
              {isProceduresOpen && (
                <ul className="ml-7 mt-3 space-y-5">
                  {procedureSubLinks.map((subLink) => (
                    <NavLink
                      key={subLink.name}
                      to={subLink.href}
                      className={({ isActive }) =>
                        isActive
                          ? "text-green-500 font-bold"
                          : "text-gray-400 hover:text-green-500"
                      }
                      onClick={close}
                    >
                      <li className="text-sm mt-3">{subLink.name}</li>
                    </NavLink>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div>
        <button className="text-red-500">Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
