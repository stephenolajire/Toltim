import React from 'react'
import { Activity, Calendar, CircleCheckBig } from 'lucide-react';

const StatCard:React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-4 md:py-10 gap-5">
      <div className="bg-blue-500 flex flex-row items-center justify-between py-6 px-4 rounded-lg hover:scale-105 transition-all duration-300">
        <div>
          <h6 className="text-gray-200 text-base font-bold">
            Total Appointments
          </h6>
          <p className="text-white text-3xl"> 12 </p>
        </div>
        <div>
          <Calendar className="h-10 w-10 text-gray-200" />
        </div>
      </div>
      <div className="bg-green-600 flex flex-row items-center justify-between py-6 px-4 rounded-lg hover:scale-105 transition-all duration-300">
        <div>
          <h6 className="text-gray-200 text-base font-bold">Completed</h6>
          <p className="text-white text-3xl"> 8 </p>
        </div>
        <div>
          <CircleCheckBig className="h-10 w-10 text-gray-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-600 to-purple-950 flex flex-row items-center justify-between py-6 px-4 rounded-lg hover:scale-105 transition-all duration-300">
        <div>
          <h6 className="text-gray-200 text-base font-bold">Health Score</h6>
          <p className="text-white text-3xl"> 95% </p>
        </div>
        <div>
          <Activity className="h-10 w-10 text-gray-200" />
        </div>
      </div>
    </section>
  );
}

export default StatCard
