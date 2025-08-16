import React from 'react'
import OverviewStatCard from '../components/overview/OverviewStatCard';
import OverviewChart from '../components/overview/OverViewChart';
import TopPerformingNurses from '../components/overview/OverviewNurses';
import UnacceptedBookings from '../components/overview/OverviewBooking';

const Overview:React.FC = () => {
  return (
    <div>
      <div className="py-5">
        <h1 className="font-bold text-black md:text-4xl text-3xl capitalize">Overview</h1>
        <p className='text-gray-500 mt-1'>Monitor your healthcare operations at a glance</p>
      </div>

      <div>
        <OverviewStatCard/>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 py-10'>
        <OverviewChart/>
        <TopPerformingNurses/>
      </div>
      <div className='pb-10'>
        <UnacceptedBookings/>
      </div>
    </div>
  );
}

export default Overview
