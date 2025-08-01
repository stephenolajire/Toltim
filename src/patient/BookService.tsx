import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  //   Stethoscope,
  //   Heart,
  //   Baby,
  CheckCircle,
  XCircle,
  CreditCard,
  Plus,
  Minus,
  Search,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Activity,
  //   Shield,
  //   Users,
  //   Bed,
  //   HeartHandshake,
  Syringe,
  HelpCircle,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  days: number;
  totalAmount: number;
}

// Mock Data - Only Nursing Procedures
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
    icon: <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
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
    icon: <Syringe className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
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
    icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
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

const NursingProcedures: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    []
  );
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredServices = nursingProcedures.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      setSelectedServices((prev) =>
        prev.filter((s) => s.service.id !== service.id)
      );
    } else {
      const newSelection: SelectedService = {
        service,
        days: 1,
        totalAmount: service.price,
      };
      setSelectedServices((prev) => [...prev, newSelection]);
    }
  };

  const updateServiceDays = (serviceId: string, increment: boolean) => {
    setSelectedServices((prev) =>
      prev.map((selected) => {
        if (selected.service.id === serviceId) {
          const newSelected = { ...selected };
          newSelected.days = Math.max(
            1,
            newSelected.days + (increment ? 1 : -1)
          );
          newSelected.totalAmount =
            newSelected.service.price * newSelected.days;
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
    return selectedServices.length;
  };

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((s) => s.service.id === serviceId);
  };

  const getSelectedService = (serviceId: string) => {
    return selectedServices.find((s) => s.service.id === serviceId);
  };

  const handleProceed = () => {
    alert("Proceeding to booking/payment page");
    // Navigate to booking/payment page
    navigate("/patient/matching");
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
        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getDepartmentColor(
                  service.category
                )}`}
              >
                {service.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg mb-1 line-clamp-2">
                  {service.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                  {service.shortDescription}
                </p>
                <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-4 space-y-1 xs:space-y-0 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{service.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-semibold text-green-600">
                      ₦{service.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 ml-2 flex-shrink-0">
              <button
                onClick={() =>
                  setExpandedService(isExpanded ? null : service.id)
                }
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              <button
                onClick={() => handleServiceSelect(service)}
                className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                  isSelected
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isSelected ? (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Selected</span>
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
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 text-xs sm:text-sm">
                    What's Included:
                  </h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-xs sm:text-sm text-gray-600"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.requirements && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-xs sm:text-sm">
                      Requirements:
                    </h4>
                    <ul className="space-y-1">
                      {service.requirements.map((requirement, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-xs sm:text-sm text-gray-600"
                        >
                          <Info className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Days Controls (only show if selected) */}
          {isSelected && selectedService && (
            <div className="mt-4 pt-4 border-t border-green-200 bg-green-25">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Number of Days
                  </label>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <button
                      onClick={() => updateServiceDays(service.id, false)}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <span className="font-semibold text-gray-900 min-w-[1.5rem] sm:min-w-[2rem] text-center text-sm sm:text-base">
                      {selectedService.days}
                    </span>
                    <button
                      onClick={() => updateServiceDays(service.id, true)}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Total:{" "}
                  </span>
                  <span className="text-sm sm:text-lg font-semibold text-green-600">
                    ₦{selectedService.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-2 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => window.history.back()}
              className="mr-2 sm:mr-4 p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-white"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Nursing Procedures
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Choose from our comprehensive nursing services
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Services List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="relative">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search nursing procedures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Services Grid */}
            <div className="space-y-4">
              {filteredServices.length > 0 ? (
                filteredServices.map(renderServiceCard)
              ) : (
                <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-8 h-8 sm:w-12 sm:h-12 mx-auto" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    No nursing procedures found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
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

                    <button
                      onClick={handleProceed}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Proceed</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
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
                      Choose nursing procedures to see your summary here
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

export default NursingProcedures;
