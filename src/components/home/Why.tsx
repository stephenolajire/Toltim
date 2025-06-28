import React from 'react'
import { LuClock4, LuMapPin, LuShield } from 'react-icons/lu';

const Why: React.FC = () => {
  return (
    <section className="w-full bg-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-4 md:px-20 lg:px-50 py-12">
      <div>
        <h3 className="text-black text-3xl font-bold mb-8">
          Why Choose Toltimed ?
        </h3>
        <div>
          <div className="flex flex-row gap-2 items-top mb-4">
            <LuShield className="text-green-500 text-4xl" />
            <div>
              <h4 className="text-black font-semibold text-base">
                Licensed Professionals
              </h4>
              <p className="text-gray-500 text-base">
                All our nurses are licensed and verified healthcare
                professionals.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-top mb-4">
            <LuMapPin className="text-green-500 text-4xl" />
            <div>
              <h4 className="text-black font-semibold text-base">
                Nationwide Coverage
              </h4>
              <p className="text-gray-500 text-base">
                Serving communities across Nigeria with expanding coverage.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-top">
            <LuClock4 className="text-green-500 text-2xl" />
            <div>
              <h4 className="text-black font-semibold text-base">
                24/7 Availability
              </h4>
              <p className="text-gray-500 text-base">
                Healthcare support when you need it, day or night.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-blue-400 p-8 rounded-lg shadow-lg h-auto flex flex-col justify-between">
        <h3 className="text-white text-2xl sm:text-3xl font-bold">
          Ready to Get Started ?
        </h3>
        <p className='text-white my-5 md:my-4 lg:my-0'>
          Join thousands of Nigerians who trust Toltimed for their healthcare
          needs.
        </p>
        <button className='bg-white text-base w-full py-2 rounded-lg font-semibold cursor-pointer hover:bg-gray-300'>
            Create Your Account
        </button>
      </div>
    </section>
  );
} 

export default Why 
