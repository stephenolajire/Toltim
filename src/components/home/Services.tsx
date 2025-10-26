import React from "react";
import {
  Heart,
  Stethoscope,
  Baby,
  Users,
  Activity,
  Pill,
  Home,
  Clock,
  CheckCircle,
//   ArrowRight,
} from "lucide-react";
// import { Link } from "react-router-dom";

const ServicesSection: React.FC = () => {
//   const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services = [
    {
      icon: Heart,
      title: "Elderly Care",
      description:
        "Compassionate care for seniors including daily living assistance, medication management, and companionship.",
      features: [
        "24/7 Monitoring",
        "Medication Management",
        "Mobility Assistance",
        "Meal Preparation",
      ],
      color: "primary",
    },
    {
      icon: Stethoscope,
      title: "Post-Surgery Care",
      description:
        "Professional nursing support for recovery at home, wound care, and rehabilitation assistance.",
      features: [
        "Wound Care",
        "Pain Management",
        "Recovery Monitoring",
        "Physical Therapy Support",
      ],
      color: "blue",
    },
    {
      icon: Baby,
      title: "Pediatric Care",
      description:
        "Specialized care for children including newborn care, vaccination support, and health monitoring.",
      features: [
        "Newborn Care",
        "Vaccination Support",
        "Health Monitoring",
        "Developmental Tracking",
      ],
      color: "purple",
    },
    {
      icon: Users,
      title: "Chronic Disease Management",
      description:
        "Ongoing support for chronic conditions like diabetes, hypertension, and heart disease.",
      features: [
        "Blood Sugar Monitoring",
        "Blood Pressure Checks",
        "Diet Consultation",
        "Medication Adherence",
      ],
      color: "green",
    },
    {
      icon: Activity,
      title: "Health Monitoring",
      description:
        "Regular vital signs checks, health assessments, and preventive care services.",
      features: [
        "Vital Signs Check",
        "Health Assessment",
        "Preventive Care",
        "Health Education",
      ],
      color: "orange",
    },
    {
      icon: Home,
      title: "Home Healthcare",
      description:
        "Comprehensive at-home medical services including IV therapy, injections, and medical procedures.",
      features: [
        "IV Therapy",
        "Injections",
        "Medical Procedures",
        "Laboratory Tests",
      ],
      color: "teal",
    },
    {
        icon: Clock,
        title: "24/7 Emergency Support",
        description:
          "Immediate access to healthcare professionals for urgent medical needs and emergencies.",
        features: [
            "Immediate Response",
            "On-Call Professionals",
            "Urgent Care Guidance",
            "Crisis Management",
        ],
        color: "blue",
    },
    {
        icon: Pill,
        title: "Medication Management",
        description:
          "Assistance with medication schedules, reminders, and administration to ensure proper adherence.",
        features: [
            "Medication Scheduling",
            "Reminders",
            "Administration Assistance",
            "Adherence Monitoring",
        ],
        color: "green",
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<
      string,
      { bg: string; hover: string; icon: string; badge: string }
    > = {
      primary: {
        bg: "bg-primary-50",
        hover: "group-hover:bg-primary-500",
        icon: "text-primary-600",
        badge: "bg-primary-100 text-primary-700",
      },
      blue: {
        bg: "bg-blue-50",
        hover: "group-hover:bg-blue-500",
        icon: "text-blue-600",
        badge: "bg-blue-100 text-blue-700",
      },
      purple: {
        bg: "bg-purple-50",
        hover: "group-hover:bg-purple-500",
        icon: "text-purple-600",
        badge: "bg-purple-100 text-purple-700",
      },
      green: {
        bg: "bg-green-50",
        hover: "group-hover:bg-green-500",
        icon: "text-green-600",
        badge: "bg-green-100 text-green-700",
      },
      orange: {
        bg: "bg-orange-50",
        hover: "group-hover:bg-orange-500",
        icon: "text-orange-600",
        badge: "bg-orange-100 text-orange-700",
      },
      teal: {
        bg: "bg-teal-50",
        hover: "group-hover:bg-teal-500",
        icon: "text-teal-600",
        badge: "bg-teal-100 text-teal-700",
      },
    };
    return colors[color] || colors.primary;
  };

  return (
    <section
      id="services"
      className="w-full lg:pb-20 md:pb-8 pb-5 px-4 md:px-8 lg:px-25"
    >
      <div className="container-custom w-full">
        {/* Section Header */}
        <div className="text-center mb-16 w-full">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4">
            <Pill className="w-full max-w-4 h-4" />
            <span className="text-body-sm font-medium">Our Services</span>
          </div>
          <h2 className="text-h2 text-gray-900 mb-4">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-body-lg text-gray-600 max-w-3xl mx-auto w-full">
            From routine care to specialized medical services, our certified
            professionals provide personalized healthcare tailored to your
            unique needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16 w-full">
          {services.map((service, index) => {
            const colors = getColorClasses(service.color);
            const Icon = service.icon;
            // const isHovered = hoveredService === index;

            return (
              <div
                key={index}
                className="group w-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                // onMouseEnter={() => setHoveredService(index)}
                // onMouseLeave={() => setHoveredService(null)}
              >
                <div className="w-full p-8">
                  {/* Icon */}
                  <div
                    className={`w-full max-w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${colors.hover}`}
                  >
                    <Icon
                      className={`w-full max-w-8 h-8 ${colors.icon} group-hover:text-white transition-colors duration-300`}
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-h5 text-gray-900 mb-3 w-full">
                    {service.title}
                  </h3>
                  <p className="text-body-sm text-gray-600 mb-6 w-full leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6 w-full">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 w-full">
                        <CheckCircle className="w-full max-w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-body-sm text-gray-700">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {/* <button className="w-full flex items-center justify-center gap-2 text-body-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group/btn">
                    Learn More
                    <ArrowRight
                      className={`w-full max-w-4 h-4 transition-transform duration-300 ${
                        isHovered ? "translate-x-1" : ""
                      }`}
                    />
                  </button> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
