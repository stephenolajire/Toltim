import React from "react";
import { Outlet } from "react-router-dom";

const AdminBookingLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminBookingLayout;
