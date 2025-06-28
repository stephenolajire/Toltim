import React from 'react'
import Hero from '../components/home/Hero'
import HowItWorks from '../components/home/HowItWorks'
import Why from '../components/home/Why'

const LandingPage: React.FC = () => {
  return (
    <main className='w-full h-auto overflow-x-hidden hide-scrollbar'>
      <Hero />
      <HowItWorks />
      <Why/>
    </main>
  )
}

export default LandingPage
