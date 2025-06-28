import React from 'react'
import { Link } from 'react-router-dom'
import { BiHeart } from 'react-icons/bi'

const Navigation: React.FC = () => {
  return (
    <header className='w-full bg-white shadow-md sticky top-0 z-50 px-2 sm:px-4 md:px-20 lg:px-50 overflow-hidden'>
      <nav className='flex items-center justify-between p-4'>
        <div className='flex items-center h-auto'>
            <BiHeart className='text-green-600 text-3xl md:text-4xl lg:text-6xl' />
            <span className='text-xl font-bold ml-0.5 sm:ml-2'>Toltimed</span>
        </div>
        <div className='flex space-x-2 lg:space-x-4'>
            <button className=' border border-gray-300 text-black px-4 py-2 rounded cursor-pointer'><Link to="/login">Login</Link></button>
            <button className='bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-900'><Link to="/register">Get Started</Link></button>
        </div>
      </nav>
    </header>
  )
}

export default Navigation;
