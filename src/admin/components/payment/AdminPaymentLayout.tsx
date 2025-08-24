import React from 'react'
import PaymentStatsCards from './PaymentStatCard'
import { Outlet } from 'react-router-dom'
import PaymentNavigation from './PaymentNav'

const AdminPaymentLayout:React.FC = () => {
  return (
    <div>
      <div className="py-5">
        <h1 className="font-bold text-black text-4xl capitalize">
          Payment Management
        </h1>
        <p className="text-gray-500 mt-1">
          Track all financial transactions and commission payments
        </p>
      </div>
      <PaymentStatsCards />
      <PaymentNavigation />
      <Outlet />
    </div>
  );
}

export default AdminPaymentLayout
