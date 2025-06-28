import React from 'react'
import { BiHeart} from 'react-icons/bi'
// import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'

const Header:React.FC = () => {
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50 px-2 sm:px-4 md:px-20 lg:px-50 overflow-hidden">
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center h-auto">
          <BiHeart className="text-green-600 text-4xl md:text-4xl lg:text-6xl" />
          <div className='flex flex-col gap-0'>
            <p className="text-xl text-green-500 font-bold">Toltimed</p>
            <span className="text-[12px] sm:text-base text-grey-900 ">
              Your Health, Our Priority
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4 lg:space-x-8">
          <div className="relative">
            <Bell className="text-gray-900 text-3xl" />
            <div className="absolute top-[-10px] right-[-6px] bg-red-700 h-5 w-5 rounded-full flex items-center justify-center text-white">
              3
            </div>
          </div>

          <div className="h-auto w-auto flex items-center lg:space-x-2">
            <div className='flex-col hidden md:block'>
              <p className="text-sm text-gray-900 font-bold">Welcome back</p>
              <span className="text-[12px] text-grey-500 ">John Doe</span>
            </div>
            <img className="h-12 w-12 rounded-full" src="/logo.jpeg" />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header
