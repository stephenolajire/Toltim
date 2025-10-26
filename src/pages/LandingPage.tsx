import React from "react";
import Hero from "../components/home/Hero";
import HowITWorks from "../components/home/HowITWorks";
import ServicesSection from "../components/home/Services";
import HealthcareWorkersSection from "../components/home/HealthCareWorkerSection";
import ContactSection from "../components/home/ContactSection";
import TestimonialsSection from "../components/home/TestimonialSection";


const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen  bg-gray-50 hide-scrollbar">
      <Hero />
      <ServicesSection />
      <HowITWorks />
      <HealthcareWorkersSection/>
      <ContactSection/>
      <TestimonialsSection/>
    </div>
  );
};

export default LandingPage;
