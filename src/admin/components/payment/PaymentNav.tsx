import React from "react";
import { NavLink } from "react-router-dom";

const PaymentNavigation: React.FC = () => {
  const userNav = [
    {
      id: 1,
      href: "/admin/payments",
      name: "Funding",
      //   icon: <User2 size={18} />,
    },
    {
      id: 2,
      href: "/admin/payments/wallet",
      name: "Wallet",
      //   icon: <CreditCard size={18} />,
    },
    {
      id: 3,
      href: "/admin/payments/withdrawal",
      name: "Withdrawal",
      //   icon: <PiHandWithdraw size={18} />,
    },
    {
      id: 4,
      href: "/admin/payments/commission",
      name: "Commission",
      //   icon: <PiHandWithdraw size={18} />,
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
            {/* <span>{nav.icon}</span> */}
            <span>{nav.name}</span>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default PaymentNavigation;
