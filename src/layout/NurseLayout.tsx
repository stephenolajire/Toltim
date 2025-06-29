import React from 'react'
import Header from '../components/common/nursedashboard/Header'
import Footer from '../components/common/Footer'
import { Outlet } from 'react-router-dom'
import NurseStat from '../components/common/nursedashboard/NurseStat'

const NurseLayout:React.FC = () => {
  return (
    <div>
      <div className='sticky'>
        <Header />
        <NurseStat />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
}

export default NurseLayout
