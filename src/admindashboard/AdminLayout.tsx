import React from 'react'
import Header from '../components/common/nursedashboard/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/common/Footer'
import DashboardMetrics from './StatCard'
// import Navigation from './Navigation'

const AdminLayout:React.FC = () => {
  return (
    <div>
      <div>
        <Header/>
        <DashboardMetrics/>
        {/* <Navigation/> */}
      </div>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default AdminLayout
