import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
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
  Syringe,
  HelpCircle,
  Info,
  MapPin,
  Loader,
  AlertCircle,
  Heart,
} from "lucide-react";
import { useNurseProcedures } from "../constant/GlobalContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// API Response Types
interface APIInclusionItem {
  id: number;
  item: string;
}

interface APIRequirementItem {
  id: number;
  item: string;
}

interface APIProcedure {
  id: number;
  procedure_id: string;
  title: string;
  description: string;
  duration: string;
  repeated_visits: boolean;
  price: string;
  icon_url: string | null;
  status: "active" | "inactive";
  inclusions: APIInclusionItem[];
  requirements: APIRequirementItem[];
  created_at: string;
  updated_at: string;
}

// Component Types
interface Service {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: string;
  category: string;
  icon?: React.ReactNode;
  features: string[];
  requirements?: string[];
  procedure_id?: string;
}

interface SelectedService {
  service: Service;
  days: number;
  totalAmount: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

const NursingProcedures: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    []
  );
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { data, isLoading } = useNurseProcedures();
  console.log(data);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setLocationLoading(false);
      return;
    }

    try {
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        console.log("Current geolocation permission:", permission.state);

        if (permission.state === "denied") {
          console.log(
            "Permission was denied, but attempting to request again..."
          );
        }
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          console.log("Location obtained:", locationData);
          setLocation(locationData);
          setLocationLoading(false);

          localStorage.setItem("userLocation", JSON.stringify(locationData));
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Unable to get your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location access and try again.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
            default:
              errorMessage = `Unknown error occurred (${error.code})`;
          }

          setLocationError(errorMessage);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    } catch (error) {
      console.error("Permission query error:", error);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          console.log("Location obtained:", locationData);
          setLocation(locationData);
          setLocationLoading(false);
          localStorage.setItem("userLocation", JSON.stringify(locationData));
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(
            "Unable to get your location. Please enable location access."
          );
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }
  };

  const transformApiDataToServices = (
    apiProcedures: APIProcedure[]
  ): Service[] => {
    return apiProcedures.map((procedure) => ({
      id: procedure.id,
      name: procedure.title,
      description: procedure.description,
      shortDescription:
        procedure.description.length > 80
          ? `${procedure.description.substring(0, 80)}...`
          : procedure.description,
      price: parseFloat(procedure.price),
      duration: procedure.duration,
      category: "nursing",
      icon: getServiceIcon(procedure.title),
      features: procedure.inclusions.map((inclusion) => inclusion.item),
      requirements: procedure.requirements.map(
        (requirement) => requirement.item
      ),
      procedure_id: procedure.procedure_id,
    }));
  };

  const getServiceIcon = (title: string): React.ReactNode => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("wound") || lowerTitle.includes("dressing")) {
      return <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />;
    }
    if (lowerTitle.includes("injection") || lowerTitle.includes("shot")) {
      return <Syringe className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />;
    }
    if (
      lowerTitle.includes("vital") ||
      lowerTitle.includes("monitoring") ||
      lowerTitle.includes("pressure")
    ) {
      return <Activity className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />;
    }
    return <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />;
  };

  const getServicesData = (): Service[] => {
    if (data?.results && data.results.length > 0) {
      const activeProcedures: any[] = data.results.filter(
        (procedure: any) => procedure.status === "active"
      );
      return transformApiDataToServices(activeProcedures);
    }
    return [];
  };

  const nursingProcedures = getServicesData();

  const filteredServices = nursingProcedures.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const updateServiceDays = (serviceId: number, increment: boolean) => {
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

  const isServiceSelected = (serviceId: number) => {
    return selectedServices.some((s) => s.service.id === serviceId);
  };

  const getSelectedService = (serviceId: number) => {
    return selectedServices.find((s) => s.service.id === serviceId);
  };

  const handleProceed = () => {
    if (selectedServices.length === 0) {
      toast.error("Please select at least one nursing procedure before proceeding.");
      return;
    }

    if (!location) {
      toast.error(
        "Location is required for booking. Please allow location access or retry getting your location."
      );
      return;
    }

    const servicesDataForAPI = selectedServices.map((selected) => ({
      service: {
        id: selected.service.id,
        name: selected.service.name,
        description: selected.service.description,
        shortDescription: selected.service.shortDescription,
        price: selected.service.price,
        duration: selected.service.duration,
        category: selected.service.category,
        features: selected.service.features,
        requirements: selected.service.requirements,
        procedure_id: selected.service.procedure_id,
      },
      days: selected.days,
      totalAmount: selected.totalAmount,
    }));

    try {
      localStorage.setItem(
        "selectedServices",
        JSON.stringify(servicesDataForAPI)
      );

      const maxDays = selectedServices.reduce(
        (max, service) => Math.max(max, service.days),
        1
      );
      localStorage.setItem("procedureDays", maxDays.toString());
      localStorage.setItem("totalAmount", getTotalAmount().toString());

      console.log("Proceeding with services:", servicesDataForAPI);
      navigate("/patient/matching");
    } catch (error) {
      console.error("Error storing services data:", error);
      toast.error("There was an error saving your selection. Please try again.");
    }
  };

  const renderLocationCard = () => {
    return (
      <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm mb-1">
              Your Location
            </h3>
            {locationLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Getting your location...</span>
              </div>
            ) : locationError ? (
              <div className="text-sm text-red-600">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold">Location Required</span>
                </div>
                <p className="text-xs text-red-500">{locationError}</p>
              </div>
            ) : location ? (
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1.5 text-green-600 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Location obtained
                  </span>
                </div>
                <p className="text-xs">
                  Lat: {location.latitude.toFixed(6)}, Lng:{" "}
                  {location.longitude.toFixed(6)}
                </p>
              </div>
            ) : null}
          </div>
          {!locationLoading && locationError && (
            <button
              onClick={getCurrentLocation}
              className="px-4 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm flex-shrink-0"
            >
              Allow Location
            </button>
          )}
        </div>

        {locationError && locationError.includes("denied") && (
          <div className="mt-3 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Need help?</strong> Click the location icon in your
              browser's address bar to enable location access, then click "Allow
              Location" again.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderServiceCard = (service: Service) => {
    const isSelected = isServiceSelected(service.id);
    const selectedService = getSelectedService(service.id);
    const isExpanded = expandedService === service.procedure_id;

    return (
      <div
        key={service.id}
        className={`bg-white rounded-xl shadow-md border-2 transition-all duration-200 ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-lg"
            : "border-blue-100 hover:border-blue-300 hover:shadow-lg"
        }`}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {service.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1.5 line-clamp-2">
                  {service.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                  {service.shortDescription}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-4 h-4 flex-shrink-0 text-blue-600" />
                    <span className="truncate">{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 flex-shrink-0 text-blue-600" />
                    <span className="font-bold text-blue-600">
                      ₦{service.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <button
                onClick={() =>
                  setExpandedService(
                    isExpanded ? null : service.procedure_id || null
                  )
                }
                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => handleServiceSelect(service)}
                className={`px-4 py-2 rounded-lg font-bold transition-all text-sm shadow-sm ${
                  isSelected
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                {isSelected ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Selected</span>
                  </div>
                ) : (
                  "Select"
                )}
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t-2 border-blue-100">
              <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    What's Included:
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.requirements && service.requirements.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      Requirements:
                    </h4>
                    <ul className="space-y-2">
                      {service.requirements.map((requirement, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {isSelected && selectedService && (
            <div className="mt-4 pt-4 border-t-2 border-blue-200 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Number of Days
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateServiceDays(service.id, false)}
                      className="w-8 h-8 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Minus className="w-4 h-4 text-blue-700" />
                    </button>
                    <span className="font-bold text-gray-900 min-w-[2rem] text-center text-lg">
                      {selectedService.days}
                    </span>
                    <button
                      onClick={() => updateServiceDays(service.id, true)}
                      className="w-8 h-8 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4 text-blue-700" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm text-gray-600 block mb-1">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">
            Loading nursing procedures...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 ">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start sm:items-center gap-3 mb-4">
            <button
              onClick={() => window.history.back()}
              className="mt-1 sm:mt-0 p-2 text-blue-600 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  Nursing Procedures
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Choose from our comprehensive nursing services (
                {nursingProcedures.length} available)
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Services List */}
          <div className="lg:col-span-2 space-y-4">
            {renderLocationCard()}

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-4">
              <div className="relative">
                <Search className="w-5 h-5 text-blue-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search nursing procedures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Services Grid */}
            <div className="space-y-4">
              {filteredServices.length > 0 ? (
                filteredServices.map(renderServiceCard)
              ) : (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center shadow-sm">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                    <Search className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No nursing procedures found
                  </h3>
                  <p className="text-sm text-gray-600">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-5 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <span>Service Summary</span>
                </h3>

                {selectedServices.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-6">
                      {selectedServices.map((selected) => (
                        <div
                          key={selected.service.id}
                          className="border-2 border-blue-100 bg-blue-50 rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-gray-900 text-sm flex-1">
                              {selected.service.name}
                            </h4>
                            <button
                              onClick={() =>
                                handleServiceSelect(selected.service)
                              }
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="text-xs text-gray-700 space-y-1">
                            <div className="font-semibold">
                              Days: {selected.days}
                            </div>
                            <div className="font-bold text-blue-600 text-sm">
                              ₦{selected.totalAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-blue-100 pt-4 mb-6">
                      <div className="flex justify-between text-sm font-semibold text-gray-700 mb-3 bg-blue-50 p-3 rounded-lg">
                        <span>Total Services:</span>
                        <span className="text-blue-600">
                          {getTotalServices()}
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl text-white shadow-md">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">Total Amount:</span>
                          <span className="text-2xl font-bold">
                            ₦{getTotalAmount().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleProceed}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <span>Proceed to Booking</span>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                      <ShoppingCart className="w-10 h-10 text-blue-400" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">
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
