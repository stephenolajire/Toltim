import React from "react";
import Hero from "../components/home/Hero";
import HowITWorks from "../components/home/HowITWorks";
import BottomSection from "../components/home/BottomSection";


const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 hide-scrollbar  px-2 sm:px-4 md:px-20 lg:px-50">
      {/* Updated Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <HowITWorks />

      {/* Bottom Section */}
      <BottomSection />
    </div>
  );
};

export default LandingPage;
