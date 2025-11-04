import {
  Heart,
  X,
  Home,
  User,
  // MessageCircle,
  HeartHandshake,
  LogOut,
  Clock,
  Bed,
  Wallet2,
} from "lucide-react";
import { useState } from "react";
import { FaServicestack } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
// import { usePatientProfile } from "../constant/GlobalContext";
// import Loading from "../components/common/Loading";
// import Error from "../components/Error";

interface SidebarProps {
  sidebarOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ sidebarOpen, closeSidebar }: SidebarProps) => {
  // const { data, isLoading, error } = usePatientProfile();

  const navigationItems = [
    { name: "Dashboard", href: "/patient", icon: Home },
    {
      name: "Nursing Procedures",
      href: "/patient/procedures",
      icon: FaServicestack,
    },
    { name: "Care Giver", href: "/patient/caregiver", icon: HeartHandshake },
    { name: "In Patient", href: "/patient/in-patient", icon: Bed },
    { name: "History", href: "/patient/history", icon: Clock },
    // { name: "Messages", href: "/patient/messages", icon: MessageCircle },
    { name: "Profile", href: "/patient/profile", icon: User },
    { name: "Wallet", href: "/patient/wallet", icon: Wallet2 },
  ];

  const [isActive, setIsActive] = useState(false);

  const handleActive = (active: boolean) => {
    setIsActive(active);
    console.log(isActive)
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  // if (isLoading) {
  //   return <Loading />;
  // }

  // if (error) {
  //   return <Error />;
  // }

  return (
    <div
      className={`
        patient-theme fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 text-blue-600" fill="white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Toltimed
          </span>
        </div>
        <button
          onClick={closeSidebar}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="pl-6">
        <p className="text-lg block text-gray-500 font-medium">
          Patient Dashboard
        </p>
      </div>

      {/* User Profile Section */}
      {/* <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center ring-2 ring-primary-100 ring-offset-2">
            <User className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {data.first_name} {data.last_name}
            </p>
            <p className="text-xs text-gray-500 font-medium">Patient Dashboard</p>
          </div>
        </div>
      </div> */}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              onClick={() => {
                handleActive(true), closeSidebar();
              }}
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary-100 text-primary-600"
                        : "bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1 h-6 bg-primary-600 rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </div>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;