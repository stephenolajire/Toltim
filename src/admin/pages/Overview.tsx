import React from 'react'
import OverviewStatCard from '../components/OverviewStatCard';
import OverviewChart from '../components/OverViewChart';
import TopPerformingNurses from '../components/OverviewNurses';
import UnacceptedBookings from '../components/OverviewBooking';

const Overview:React.FC = () => {
  return (
    <div>
      <div className="py-5">
        <h1 className="font-bold text-black text-4xl capitalize">Overview</h1>
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
