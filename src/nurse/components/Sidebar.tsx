import {
  Home,
  Shield,
  Stethoscope,
  User,
  Wallet,
  Calendar
} from "lucide-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProp {
  close: () => void;
}

const adminLinks = [
  {
    name: "overview",
    href: "/nurse",
    icon: <Home size={16} />,
  },
  {
    name: "active patients",
    href: "/nurse/active-patients",
    icon: <User size={16} />,
  },
  {
    name: "appointments",
    href: "/nurse/appointments",
    icon: <Calendar size={16} />,
  },
  {
    name: "wallet",
    href: "/nurse/wallet",
    icon: <Wallet size={16} />,
  },
  {
    name: "id-card",
    href: "/nurse/id-card",
    icon: <Shield size={16} />,
  },

  {
    name: "profile",
    href: "/nurse/profile",
    icon: <User size={16} />,
  },
];

const Sidebar: React.FC<SidebarProp> = ({ close }) => {

  const Navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    Navigate("/")
  }
  return (
    <div className="md:w-[250px] w-[300px] h-screen bg-white border border-l-0 border-t-0 border-b-0 border-r-white shadow-sm fixed p-4 rounded-tl-2xl rounded-bl-2xl flex flex-col justify-between">
      <div>
        <div className="flex space-x-3 items-center pb-10">
          <div>
            <Stethoscope className="text-green-500" />
          </div>
          <div>
            <h3 className="text-green-500 text-2xl font-bold">Toltim</h3>
            <p className="text-sm text-gray-500">Nurse Panel</p>
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
          </ul>
        </div>
      </div>

      <div>
        <button onClick={handleLogout} className="text-red-500">Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
