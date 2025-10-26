import React from "react";
import {
  Search,
  UserCheck,
  Calendar,
  CheckCircle,
} from "lucide-react";

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: "Search & Browse",
      description:
        "Browse certified nurses and community health workers. Filter by location, specialty, and availability to find the right professional for your needs.",
    },
    {
      icon: UserCheck,
      title: "Select Your Professional",
      description:
        "Review profiles with qualifications, experience, and patient reviews. Choose a healthcare worker who meets your requirements.",
    },
    {
      icon: Calendar,
      title: "Schedule Appointment",
      description:
        "Pick a convenient date and time. Book same-day appointments or schedule in advance based on availability.",
    },
    {
      icon: CheckCircle,
      title: "Receive Quality Care",
      description:
        "Your healthcare professional arrives at your home at the scheduled time to provide compassionate, professional care.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="lg:pb-20 md:pb-8 pb-5 px-4 md:px-8 lg:px-25 bg-gray-50"
    >
      <div className="w-full mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting professional healthcare at home is simple. Follow these four
            easy steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
