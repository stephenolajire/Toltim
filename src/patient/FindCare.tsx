import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Phone,
  MessageCircle,
  User,
  Stethoscope,
  Heart,
  UserCheck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

// Types
interface Provider {
  id: string;
  name: string;
  type: "doctor" | "nurse" | "chw";
  specialty: string;
  distance: number;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  consultationFee: number;
  homeVisitFee?: number;
  availability: "available" | "busy" | "offline";
  nextAvailableSlot: string;
  profileImage?: string;
  verified: boolean;
  languages: string[];
  location: string;
}

// Mock data
const mockProviders: Provider[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    type: "doctor",
    specialty: "Gynecologist",
    distance: 2.5,
    rating: 4.8,
    reviewCount: 124,
    yearsExperience: 12,
    consultationFee: 8000,
    homeVisitFee: 15000,
    availability: "available",
    nextAvailableSlot: "Today, 3:00 PM",
    verified: true,
    languages: ["English", "Igbo"],
    location: "Onitsha Main Market",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    type: "doctor",
    specialty: "General Practice",
    distance: 1.8,
    rating: 4.9,
    reviewCount: 89,
    yearsExperience: 8,
    consultationFee: 6000,
    homeVisitFee: 12000,
    availability: "available",
    nextAvailableSlot: "Tomorrow, 9:00 AM",
    verified: true,
    languages: ["English"],
    location: "GRA Onitsha",
  },
  {
    id: "3",
    name: "Nurse Mary Adams",
    type: "nurse",
    specialty: "Home Care Nursing",
    distance: 0.8,
    rating: 4.7,
    reviewCount: 67,
    yearsExperience: 6,
    consultationFee: 3500,
    homeVisitFee: 5000,
    availability: "available",
    nextAvailableSlot: "Today, 1:00 PM",
    verified: true,
    languages: ["English", "Igbo"],
    location: "Fegge",
  },
  {
    id: "4",
    name: "CHW James Wilson",
    type: "chw",
    specialty: "Community Health",
    distance: 1.2,
    rating: 4.6,
    reviewCount: 45,
    yearsExperience: 4,
    consultationFee: 2000,
    homeVisitFee: 3000,
    availability: "busy",
    nextAvailableSlot: "Tomorrow, 2:00 PM",
    verified: true,
    languages: ["English", "Igbo", "Yoruba"],
    location: "Woliwo",
  },
  {
    id: "5",
    name: "Dr. Adaora Okafor",
    type: "doctor",
    specialty: "Pediatrician",
    distance: 3.2,
    rating: 4.9,
    reviewCount: 156,
    yearsExperience: 15,
    consultationFee: 7500,
    homeVisitFee: 14000,
    availability: "available",
    nextAvailableSlot: "Today, 4:30 PM",
    verified: true,
    languages: ["English", "Igbo"],
    location: "3-3 Onitsha",
  },
  {
    id: "6",
    name: "Nurse Patricia Eze",
    type: "nurse",
    specialty: "Maternal Health",
    distance: 2.1,
    rating: 4.8,
    reviewCount: 92,
    yearsExperience: 10,
    consultationFee: 4000,
    homeVisitFee: 6000,
    availability: "available",
    nextAvailableSlot: "Tomorrow, 11:00 AM",
    verified: true,
    languages: ["English", "Igbo"],
    location: "Upper Iweka",
  },
  {
    id: "7",
    name: "Dr. Emeka Nwosu",
    type: "doctor",
    specialty: "Cardiologist",
    distance: 4.5,
    rating: 4.7,
    reviewCount: 78,
    yearsExperience: 18,
    consultationFee: 10000,
    homeVisitFee: 18000,
    availability: "offline",
    nextAvailableSlot: "Monday, 10:00 AM",
    verified: true,
    languages: ["English", "Igbo"],
    location: "Awka Road",
  },
  {
    id: "8",
    name: "CHW Grace Okwu",
    type: "chw",
    specialty: "Maternal & Child Health",
    distance: 1.5,
    rating: 4.5,
    reviewCount: 34,
    yearsExperience: 3,
    consultationFee: 1800,
    homeVisitFee: 2500,
    availability: "available",
    nextAvailableSlot: "Today, 5:00 PM",
    verified: true,
    languages: ["English", "Igbo"],
    location: "Ochanja Market",
  },
];

// Specialty options
const specialties = {
  doctor: [
    "General Practice",
    "Gynecologist",
    "Pediatrician",
    "Cardiologist",
    "Dermatologist",
    "Orthopedic Surgeon",
    "Neurologist",
    "Psychiatrist",
  ],
  nurse: [
    "Home Care Nursing",
    "Maternal Health",
    "Pediatric Nursing",
    "Geriatric Care",
    "Wound Care",
    "Chronic Disease Management",
  ],
  chw: [
    "Community Health",
    "Maternal & Child Health",
    "Disease Prevention",
    "Health Education",
    "Basic Primary Care",
  ],
};

// Provider Card Component
const ProviderCard: React.FC<{
  provider: Provider;
  onBook: (provider: Provider) => void;
}> = ({ provider, onBook }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "doctor":
        return <Stethoscope className="w-5 h-5" />;
      case "nurse":
        return <Heart className="w-5 h-5" />;
      case "chw":
        return <UserCheck className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "doctor":
        return "bg-blue-100 text-blue-600";
      case "nurse":
        return "bg-green-100 text-green-600";
      case "chw":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Available
          </span>
        );
      case "busy":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Busy
          </span>
        );
      case "offline":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Offline
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(
              provider.type
            )}`}
          >
            {getTypeIcon(provider.type)}
          </div>
          <div className="ml-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {provider.name}
              </h3>
              {provider.verified && (
                <div className="ml-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 capitalize">
              {provider.type} • {provider.specialty}
            </p>
            <div className="flex items-center mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">
                {provider.rating} ({provider.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
        {getAvailabilityBadge(provider.availability)}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {provider.distance} km away • {provider.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          {provider.yearsExperience} years experience
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Consultation: ₦{provider.consultationFee.toLocaleString()}
          </p>
          {provider.homeVisitFee && (
            <p className="text-sm text-gray-600">
              Home visit: ₦{provider.homeVisitFee.toLocaleString()}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">Next available:</p>
          <p className="text-sm text-green-600">{provider.nextAvailableSlot}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Languages: {provider.languages.join(", ")}
        </p>
      </div>

      <div className="flex space-x-3">
        <Link to= "/patient/appointments" className="flex-1">
          <button
            onClick={() => onBook(provider)}
            className="flex-1 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Book Appointment
          </button>
        </Link>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <Phone className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Filter Component
const FilterPanel: React.FC<{
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (availability: string) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}> = ({
  selectedType,
  setSelectedType,
  selectedSpecialty,
  setSelectedSpecialty,
  availabilityFilter,
  setAvailabilityFilter,
  maxDistance,
  setMaxDistance,
  showFilters,
  setShowFilters,
}) => {
  const availableSpecialties =
    selectedType === "all"
      ? [...specialties.doctor, ...specialties.nurse, ...specialties.chw]
      : specialties[selectedType as keyof typeof specialties] || [];

  if (!showFilters) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setShowFilters(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Provider Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provider Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setSelectedSpecialty("all");
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="doctor">Doctors</option>
            <option value="nurse">Nurses</option>
            <option value="chw">Community Health Workers</option>
          </select>
        </div>

        {/* Specialty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialty
          </label>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Specialties</option>
            {availableSpecialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="available">Available Now</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Distance: {maxDistance} km
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

// Main Find Care Component
const FindCare: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [maxDistance, setMaxDistance] = useState(5);
  const [showFilters, setShowFilters] = useState(false);

  // Filter providers based on search criteria
  const filteredProviders = useMemo(() => {
    return mockProviders.filter((provider) => {
      // Search query filter
      if (
        searchQuery &&
        !provider.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !provider.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Type filter
      if (selectedType !== "all" && provider.type !== selectedType) {
        return false;
      }

      // Specialty filter
      if (
        selectedSpecialty !== "all" &&
        provider.specialty !== selectedSpecialty
      ) {
        return false;
      }

      // Availability filter
      if (
        availabilityFilter !== "all" &&
        provider.availability !== availabilityFilter
      ) {
        return false;
      }

      // Distance filter
      if (provider.distance > maxDistance) {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedType,
    selectedSpecialty,
    availabilityFilter,
    maxDistance,
  ]);

  // Get counts by type
  const typeCounts = useMemo(() => {
    return {
      doctors: filteredProviders.filter((p) => p.type === "doctor").length,
      nurses: filteredProviders.filter((p) => p.type === "nurse").length,
      chws: filteredProviders.filter((p) => p.type === "chw").length,
    };
  }, [filteredProviders]);

  const handleBookAppointment = (provider: Provider) => {
    // This would typically open a booking modal or navigate to booking page
    alert(`Booking appointment with ${provider.name}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedSpecialty("all");
    setAvailabilityFilter("all");
    setMaxDistance(5);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Find Care Providers
        </h1>
        <p className="text-gray-600">
          Discover qualified healthcare professionals in your area
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Quick Type Filters */}
          <div className="flex space-x-2">
            {["all", "doctor", "nurse", "chw"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setSelectedSpecialty("all");
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === type
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type === "all"
                  ? "All"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
                s
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              showFilters
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Results Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredProviders.length} Providers Found
            </h2>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>{typeCounts.doctors} Doctors</span>
              <span>{typeCounts.nurses} Nurses</span>
              <span>{typeCounts.chws} CHWs</span>
            </div>
          </div>
          {(searchQuery ||
            selectedType !== "all" ||
            selectedSpecialty !== "all" ||
            availabilityFilter !== "all" ||
            maxDistance !== 5) && (
            <button
              onClick={clearFilters}
              className="mt-4 md:mt-0 text-green-600 hover:text-green-700 font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onBook={handleBookAppointment}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Providers Found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or expanding your search radius.
          </p>
          <button
            onClick={clearFilters}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FindCare;
