import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'

const Layout:React.FC = () => {
  return (
    <div>
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout

