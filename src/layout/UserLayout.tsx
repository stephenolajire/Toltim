import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/common/userdashboard/Header'
import Footer from '../components/common/Footer'

const UserLayout:React.FC = () => {
  return (
    <div>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default UserLayout
