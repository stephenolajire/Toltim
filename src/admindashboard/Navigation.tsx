import React from "react";
import { NavLink } from "react-router-dom";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const Navigation: React.FC = () => {
  const navItems: NavItem[] = [
    {
      id: "verifications",
      label: "Verifications",
      href: "/admin",
    },
    { id: "payments", label: "Payments", href: "/admin/payments" },
    {
      id: "delayed-sessions",
      label: "Delayed Sessions",
      href: "/admin/delayed-sessions",
    },
    { id: "patients", label: "Patients", href: "/admin/patients" },
    { id: "bookings", label: "Bookings", href: "/admin/bookings" },
    { id: "treatments", label: "Treatments", href: "/admin/treatments" },
    { id: "procedures", label: "Procedures", href: "/admin/procedures" },
    { id: "caregivers", label: "Caregivers", href: "/admin/caregivers" },
    {
      id: "in-patient-care",
      label: "In-Patient Care",
      href: "/admin/in-patient-care",
    },
    { id: "analytics", label: "Analytics", href: "/admin/analytics" },
  ];

  const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap hide-scrollbar ${
      isActive
        ? "bg-white text-gray-900 shadow-sm border border-gray-200"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }`;

  return (
    <div className="w-full bg-gray-50 border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Mobile and Tablet - Horizontal Scrolling */}
        <div className="block lg:hidden">
          <div className="overflow-x-auto">
            <div className="flex space-x-2 py-4 min-w-max">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.href}
                  className={getNavLinkClassName}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop - Wrapped Layout */}
        <div className="hidden lg:block">
          <div className="flex flex-wrap gap-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.href}
                className={getNavLinkClassName}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
