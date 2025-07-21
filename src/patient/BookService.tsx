import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
//   MapPin,
//   Star,
  Stethoscope,
  Heart,
  Baby,
//   UserCheck,
//   User,
//   Home,
//   Building,
  CheckCircle,
  XCircle,
//   AlertCircle,
//   Calendar,
  CreditCard,
  Plus,
  Minus,
//   Filter,
  Search,
//   Eye,
//   Phone,
//   MessageSquare,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Activity,
  Shield,
  Users,
  Bed,
  HeartHandshake,
  Syringe,
//   ThermometerSun,
//   Pill,
  HelpCircle,
//   HelpCircle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: string;
  category: string;
  icon?: React.ReactNode;
  features: string[];
  requirements?: string[];
}

interface SelectedService {
  service: Service;
  quantity: number;
  days: number;
  totalAmount: number;
}

// Mock Data
const nursingProcedures: Service[] = [
  {
    id: "np-001",
    name: "Wound Care & Dressing",
    shortDescription: "Professional wound cleaning, dressing, and monitoring",
    description:
      "Complete wound care service including cleaning, antiseptic application, proper dressing, and healing progress monitoring. Our trained nurses ensure sterile conditions and proper healing techniques.",
    price: 3500,
    duration: "30-45 minutes",
    category: "nursing",
    icon: <HelpCircle className="w-6 h-6" />,
    features: [
      "Sterile wound cleaning",
      "Antiseptic application",
      "Professional dressing",
      "Healing progress monitoring",
      "Pain management guidance",
      "Follow-up care instructions",
    ],
    requirements: ["Medical history", "Previous dressing materials (if any)"],
  },
  {
    id: "np-002",
    name: "Injection Administration",
    shortDescription:
      "Safe administration of prescribed medications via injection",
    description:
      "Professional administration of intramuscular, subcutaneous, and intravenous injections as prescribed by your doctor. Includes proper disposal of medical waste.",
    price: 2000,
    duration: "15-20 minutes",
    category: "nursing",
    icon: <Syringe className="w-6 h-6" />,
    features: [
      "IM/SC/IV injections",
      "Medication verification",
      "Sterile technique",
      "Safe needle disposal",
      "Adverse reaction monitoring",
      "Documentation",
    ],
    requirements: ["Doctor's prescription", "Medication to be administered"],
  },
  {
    id: "np-003",
    name: "Vital Signs Monitoring",
    shortDescription:
      "Regular monitoring of blood pressure, temperature, pulse",
    description:
      "Comprehensive vital signs assessment including blood pressure, temperature, pulse rate, respiratory rate, and oxygen saturation monitoring with detailed reporting.",
    price: 1500,
    duration: "20-30 minutes",
    category: "nursing",
    icon: <Activity className="w-6 h-6" />,
    features: [
      "Blood pressure check",
      "Temperature monitoring",
      "Pulse rate assessment",
      "Respiratory rate check",
      "Oxygen saturation (if available)",
      "Detailed health report",
    ],
  },
];

const careGiverServices: Service[] = [
  {
    id: "cg-001",
    name: "Personal Care Assistance",
    shortDescription:
      "Daily living activities support and personal hygiene care",
    description:
      "Comprehensive personal care including bathing assistance, grooming, dressing, mobility support, and maintaining personal hygiene for elderly or disabled individuals.",
    price: 8000,
    duration: "2-4 hours",
    category: "caregiver",
    icon: <HeartHandshake className="w-6 h-6" />,
    features: [
      "Bathing assistance",
      "Grooming and hygiene",
      "Dressing support",
      "Mobility assistance",
      "Medication reminders",
      "Companionship",
      "Light housekeeping",
    ],
    requirements: ["Care plan discussion", "Emergency contacts"],
  },
  {
    id: "cg-002",
    name: "Elderly Companion Care",
    shortDescription: "Compassionate companionship and monitoring for seniors",
    description:
      "Dedicated companionship service for elderly individuals including conversation, light activities, meal preparation assistance, and safety monitoring.",
    price: 6000,
    duration: "4-8 hours",
    category: "caregiver",
    icon: <Users className="w-6 h-6" />,
    features: [
      "Friendly companionship",
      "Safety monitoring",
      "Meal preparation help",
      "Light exercise encouragement",
      "Medication reminders",
      "Emergency response",
      "Activity engagement",
    ],
  },
  {
    id: "cg-003",
    name: "Post-Surgery Care",
    shortDescription:
      "Specialized care and monitoring after surgical procedures",
    description:
      "Professional post-operative care including incision monitoring, medication management, mobility assistance, and recovery support following surgical procedures.",
    price: 12000,
    duration: "6-8 hours",
    category: "caregiver",
    icon: <Shield className="w-6 h-6" />,
    features: [
      "Incision site monitoring",
      "Pain management support",
      "Medication administration",
      "Mobility assistance",
      "Physical therapy support",
      "Infection prevention",
      "Recovery progress tracking",
    ],
    requirements: [
      "Surgical discharge notes",
      "Medication list",
      "Doctor's instructions",
    ],
  },
];

const inPatientServices: Service[] = [
  {
    id: "ip-001",
    name: "24/7 In-Home Patient Care",
    shortDescription: "Round-the-clock professional medical care in your home",
    description:
      "Comprehensive 24-hour in-home patient care with qualified nurses and caregivers. Includes medication management, vital signs monitoring, personal care, and medical equipment management.",
    price: 35000,
    duration: "24 hours",
    category: "inpatient",
    icon: <Bed className="w-6 h-6" />,
    features: [
      "24/7 professional supervision",
      "Medication management",
      "Vital signs monitoring",
      "Personal care assistance",
      "Medical equipment management",
      "Emergency response",
      "Family communication",
      "Progress reporting",
    ],
    requirements: [
      "Medical history",
      "Current medications",
      "Emergency contacts",
      "Doctor's care plan",
    ],
  },
  {
    id: "ip-002",
    name: "Pediatric Home Care",
    shortDescription:
      "Specialized care for children with medical needs at home",
    description:
      "Expert pediatric care for children with special medical needs, chronic conditions, or recovering from illness. Child-friendly approach with family-centered care.",
    price: 25000,
    duration: "12 hours",
    category: "inpatient",
    icon: <Baby className="w-6 h-6" />,
    features: [
      "Pediatric-trained nurses",
      "Child-friendly care approach",
      "Family education and support",
      "Growth and development monitoring",
      "Medication administration",
      "Feeding assistance",
      "Play therapy integration",
      "School coordination (if needed)",
    ],
    requirements: [
      "Pediatric medical records",
      "Vaccination records",
      "Emergency contacts",
      "Pediatrician contact",
    ],
  },
  {
    id: "ip-003",
    name: "Rehabilitation Support Care",
    shortDescription: "Intensive rehabilitation and therapy support at home",
    description:
      "Comprehensive rehabilitation care including physical therapy support, occupational therapy assistance, and recovery monitoring for patients recovering from stroke, injury, or surgery.",
    price: 20000,
    duration: "8 hours",
    category: "inpatient",
    icon: <HelpCircle className="w-6 h-6" />,
    features: [
      "Physical therapy support",
      "Occupational therapy assistance",
      "Mobility training",
      "Exercise program guidance",
      "Progress monitoring",
      "Equipment training",
      "Family education",
      "Goal setting and tracking",
    ],
    requirements: [
      "Rehabilitation plan",
      "Therapy equipment (if any)",
      "Medical clearance",
    ],
  },
];

const BookService: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "nursing" | "caregiver" | "inpatient"
  >("nursing");
  const [services, setServices] = useState<Service[]>(nursingProcedures);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    []
  );
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate API fetch
  const fetchServices = async (department: string) => {
    setLoading(true);
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (department) {
      case "nursing":
        setServices(nursingProcedures);
        break;
      case "caregiver":
        setServices(careGiverServices);
        break;
      case "inpatient":
        setServices(inPatientServices);
        break;
      default:
        setServices(nursingProcedures);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices(activeTab);
  }, [activeTab]);

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "nursing":
        return <Stethoscope className="w-5 h-5" />;
      case "caregiver":
        return <HeartHandshake className="w-5 h-5" />;
      case "inpatient":
        return <Bed className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "nursing":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "caregiver":
        return "bg-green-100 text-green-600 border-green-200";
      case "inpatient":
        return "bg-purple-100 text-purple-600 border-purple-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const handleServiceSelect = (service: Service) => {
    const existingIndex = selectedServices.findIndex(
      (s) => s.service.id === service.id
    );

    if (existingIndex >= 0) {
      // Remove service if already selected
      setSelectedServices((prev) =>
        prev.filter((s) => s.service.id !== service.id)
      );
    } else {
      // Add new service
      const newSelection: SelectedService = {
        service,
        quantity: 1,
        days: 1,
        totalAmount: service.price,
      };
      setSelectedServices((prev) => [...prev, newSelection]);
    }
  };

  const updateServiceQuantity = (
    serviceId: string,
    type: "quantity" | "days",
    increment: boolean
  ) => {
    setSelectedServices((prev) =>
      prev.map((selected) => {
        if (selected.service.id === serviceId) {
          const newSelected = { ...selected };

          if (type === "quantity") {
            newSelected.quantity = Math.max(
              1,
              newSelected.quantity + (increment ? 1 : -1)
            );
          } else {
            newSelected.days = Math.max(
              1,
              newSelected.days + (increment ? 1 : -1)
            );
          }

          newSelected.totalAmount =
            newSelected.service.price * newSelected.quantity * newSelected.days;
          return newSelected;
        }
        return selected;
      })
    );
  };

  const getTotalAmount = () => {
    return selectedServices.reduce(
      (total, selected) => total + selected.totalAmount,
      0
    );
  };

  const getTotalServices = () => {
    return selectedServices.reduce(
      (total, selected) => total + selected.quantity,
      0
    );
  };

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((s) => s.service.id === serviceId);
  };

  const getSelectedService = (serviceId: string) => {
    return selectedServices.find((s) => s.service.id === serviceId);
  };

  const renderServiceCard = (service: Service) => {
    const isSelected = isServiceSelected(service.id);
    const selectedService = getSelectedService(service.id);
    const isExpanded = expandedService === service.id;

    return (
      <div
        key={service.id}
        className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 ${
          isSelected
            ? "border-green-500 bg-green-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* Service Header */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${getDepartmentColor(
                  service.category
                )}`}
              >
                {service.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {service.shortDescription}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-semibold text-green-600">
                      ₦{service.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() =>
                  setExpandedService(isExpanded ? null : service.id)
                }
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => handleServiceSelect(service)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isSelected
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isSelected ? (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Selected</span>
                  </div>
                ) : (
                  "Select"
                )}
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    What's Included:
                  </h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.requirements && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Requirements:
                    </h4>
                    <ul className="space-y-1">
                      {service.requirements.map((requirement, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-2 text-sm text-gray-600"
                        >
                          <Info className="w-3 h-3 text-blue-500 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantity Controls (only show if selected) */}
          {isSelected && selectedService && (
            <div className="mt-4 pt-4 border-t border-green-200 bg-green-25">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        updateServiceQuantity(service.id, "quantity", false)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                      {selectedService.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateServiceQuantity(service.id, "quantity", true)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        updateServiceQuantity(service.id, "days", false)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                      {selectedService.days}
                    </span>
                    <button
                      onClick={() =>
                        updateServiceQuantity(service.id, "days", true)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-right">
                <span className="text-sm text-gray-600">Total: </span>
                <span className="text-lg font-semibold text-green-600">
                  ₦{selectedService.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => window.history.back()}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book Service</h1>
              <p className="text-gray-600">
                Choose from our comprehensive healthcare services
              </p>
            </div>
          </div>

          {/* Department Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <div className="grid grid-cols-3 gap-1 overflow-x-auto">
              {[
                {
                  key: "nursing",
                  label: "Nursing Procedures",
                  count: nursingProcedures.length,
                },
                {
                  key: "caregiver",
                  label: "CareGiver",
                  count: careGiverServices.length,
                },
                {
                  key: "inpatient",
                  label: "InPatient",
                  count: inPatientServices.length,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-green-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {getDepartmentIcon(tab.key)}
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === tab.key ? "bg-green-500" : "bg-gray-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Services List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Services Grid */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-6 animate-pulse"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.length > 0 ? (
                  filteredServices.map(renderServiceCard)
                ) : (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No services found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Service Summary</span>
                </h3>

                {selectedServices.length > 0 ? (
                  <>
                    <div className="space-y-4 mb-6">
                      {selectedServices.map((selected) => (
                        <div
                          key={selected.service.id}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {selected.service.name}
                            </h4>
                            <button
                              onClick={() =>
                                handleServiceSelect(selected.service)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Quantity: {selected.quantity}</div>
                            <div>Days: {selected.days}</div>
                            <div className="font-semibold text-green-600">
                              ₦{selected.totalAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Total Services:</span>
                        <span>{getTotalServices()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total Amount:</span>
                        <span className="text-green-600">
                          ₦{getTotalAmount().toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Link to="/patient/matching" className="w-full">
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                        <span>Proceed</span>
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <ShoppingCart className="w-12 h-12 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      No services selected
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Choose services to see your summary here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
