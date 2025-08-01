import {
  Heart,
  X,
  Home,
  User,
  MessageCircle,
  HeartHandshake,
  LogOut,
  Clock,
  Bed,
} from "lucide-react";
import { useState } from "react";
import { FaServicestack } from "react-icons/fa";
import { NavLink } from "react-router-dom";

// Define the props interface
interface SidebarProps {
  sidebarOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ sidebarOpen, closeSidebar }: SidebarProps) => {
  const navigationItems = [
    { name: "Dashboard", href: "/patient", icon: Home },
    { name: "Nursing Procedures", href: "/patient/procedures", icon: FaServicestack },
    { name: "Care Giver", href: "/patient/caregiver", icon: HeartHandshake },
    { name: "In Patient", href: "/patient/in-patient", icon: Bed },
    { name: "History", href: "/patient/history", icon: Clock },
    { name: "Messages", href: "/patient/messages", icon: MessageCircle },
    { name: "Profile", href: "/patient/profile", icon: User },
    // { name: "Settings", href: "/settings", icon: Settings },
    // { name: "My Location", href: "/location", icon: MapPin },
  ];

  const [isActive, setIsActive] = useState(false);

  const handleActive = (active: boolean) => {   
    setIsActive(active);
  };

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <Heart className="w-8 h-8 text-green-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Toltimed</span>
        </div>
        <button
          onClick={closeSidebar}
          className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">John Doe</p>
            <p className="text-xs text-gray-500">Patient</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
            onClick={() => handleActive(true)}
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-700 border-r-4 border-green-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon
                className={`mr-3 h-5 w-5 transition-colors ${
                  isActive
                    ? "text-green-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
