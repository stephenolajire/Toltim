import {
  Calendar,
  Home,
  Shield,
  Stethoscope,
  User,
  Wallet,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarProp {
    close: ()=> void
}

const adminLinks = [
  {
    name: "overview",
    href: "/admin",
    icon: <Home size={16}/>,
  },
  {
    name: "bookings",
    href: "/admin/bookings",
    icon: <Calendar size={16}/>,
  },
  {
    name: "users",
    href: "/admin/users",
    icon: <User size={16}/>,
  },
  {
    name: "payments",
    href: "/admin/payments",
    icon: <Wallet size={16}/>,
  },
  {
    name: "verifications",
    href: "/admin/verifications",
    icon: <Shield size={16}/>,
  },
  {
    name: "procedures",
    href: "/admin/procedures",
    icon: <Stethoscope size={16}/>,
  },
];

const Sidebar: React.FC<SidebarProp> = ({close}) => {
  return (
    <div className="md:w-[220px] w-[300px] h-screen bg-gray-50 border border-l-0 border-t-0 border-b-0 border-r-gray-300 fixed p-4 rounded-tl-2xl rounded-bl-2xl flex flex-col justify-between">
      <div>
        <div className="flex space-x-3 items-center pb-10">
          <div>
            <Stethoscope />
          </div>
          <div>
            <h3 className="text-black text-2xl font-bold">Toltim</h3>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 pb-5">Main Navigation</p>
          <ul className="flex flex-col space-y-5">
            {adminLinks.map((nav) => (
              <NavLink
                className={({ isActive}) =>
                  isActive ? "text-black font-bold" : "text-gray-500"
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
        <button className="text-red-500">Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
