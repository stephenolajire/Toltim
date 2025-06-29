import React from 'react'
import StatCard from './components/StatCard'
import Appointment from './components/Appointment';
import QuickAction from './components/QuickAction';
import Notification from './components/Notification';

const Home:React.FC = () => {
  return (
    <main className="h-auto w-full hide-scrollbar bg-gray-200 px-4 sm:px-4 md:px-20 lg:px-50 ">
      <StatCard />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Appointment />
        <QuickAction />
        <Notification />
      </section>
    </main>
  );
}

export default Home
