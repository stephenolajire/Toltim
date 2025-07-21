import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  User,
  CheckCircle,
  Calendar,
  Search,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Users,
  Award,
  Verified,
  BookOpen,
  ThumbsUp,
} from "lucide-react";

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

interface Practitioner {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experience: string;
  rating: number;
  reviewCount: number;
  profileImage: string;
  location: string;
  distance: string;
  priceRange: string;
  languages: string[];
  qualifications: string[];
  services: string[];
  isVerified: boolean;
  responseTime: string;
  completedCases: number;
  availability: {
    date: string;
    slots: string[];
  }[];
  bio: string;
}

interface BookingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  relationship: string;
}

// Mock Data
const mockServices = [
  {
    id: "np-001",
    name: "Wound Care & Dressing",
    description: "Professional wound cleaning, dressing, and monitoring",
    price: 3500,
    duration: "30-45 minutes",
    category: "nursing",
  },
  {
    id: "cg-001",
    name: "Personal Care Assistance",
    description: "Daily living activities support and personal hygiene care",
    price: 8000,
    duration: "2-4 hours",
    category: "caregiver",
  },
];

const mockPractitioners: Practitioner[] = [
  {
    id: "prac-001",
    name: "Sarah Johnson",
    title: "Registered Nurse",
    specialization: "Wound Care Specialist",
    experience: "8 years",
    rating: 4.9,
    reviewCount: 127,
    profileImage:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    location: "Victoria Island, Lagos",
    distance: "2.3 km away",
    priceRange: "₦3,000 - ₦5,000",
    languages: ["English", "Yoruba"],
    qualifications: ["RN License", "BSN Degree", "Wound Care Certification"],
    services: ["Wound Care", "IV Therapy", "Medication Administration"],
    isVerified: true,
    responseTime: "Usually responds within 30 minutes",
    completedCases: 340,
    bio: "Experienced registered nurse with specialization in wound care and post-operative care. Committed to providing compassionate, evidence-based care.",
    availability: [
      {
        date: "2025-07-22",
        slots: ["09:00", "11:00", "14:00", "16:00"],
      },
      {
        date: "2025-07-23",
        slots: ["08:00", "10:00", "13:00", "15:00", "17:00"],
      },
      {
        date: "2025-07-24",
        slots: ["09:00", "12:00", "14:00"],
      },
    ],
  },
  {
    id: "prac-002",
    name: "Michael Adebayo",
    title: "Licensed Practical Nurse",
    specialization: "General Nursing Care",
    experience: "5 years",
    rating: 4.7,
    reviewCount: 89,
    profileImage:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    location: "Ikeja, Lagos",
    distance: "4.1 km away",
    priceRange: "₦2,500 - ₦4,000",
    languages: ["English", "Igbo"],
    qualifications: [
      "LPN License",
      "Basic Life Support",
      "First Aid Certified",
    ],
    services: [
      "Vital Signs Monitoring",
      "Medication Reminders",
      "Basic Nursing Care",
    ],
    isVerified: true,
    responseTime: "Usually responds within 1 hour",
    completedCases: 156,
    bio: "Dedicated nursing professional focused on providing quality patient care and building strong relationships with families.",
    availability: [
      {
        date: "2025-07-22",
        slots: ["08:00", "10:00", "15:00"],
      },
      {
        date: "2025-07-23",
        slots: ["09:00", "11:00", "14:00", "16:00"],
      },
      {
        date: "2025-07-24",
        slots: ["08:00", "13:00", "15:00", "17:00"],
      },
    ],
  },
  {
    id: "prac-003",
    name: "Grace Okafor",
    title: "Certified Nursing Assistant",
    specialization: "Elderly Care & Personal Assistance",
    experience: "6 years",
    rating: 4.8,
    reviewCount: 203,
    profileImage:
      "https://images.unsplash.com/photo-1594824884763-8b88ca397d7e?w=150&h=150&fit=crop&crop=face",
    location: "Lekki, Lagos",
    distance: "1.8 km away",
    priceRange: "₦4,000 - ₦8,000",
    languages: ["English", "Yoruba", "Hausa"],
    qualifications: [
      "CNA Certification",
      "Geriatric Care Training",
      "CPR Certified",
    ],
    services: ["Personal Care", "Companionship", "Mobility Assistance"],
    isVerified: true,
    responseTime: "Usually responds within 15 minutes",
    completedCases: 420,
    bio: "Compassionate caregiver specializing in elderly care and personal assistance. Known for patience and attention to detail.",
    availability: [
      {
        date: "2025-07-22",
        slots: ["07:00", "12:00", "18:00"],
      },
      {
        date: "2025-07-23",
        slots: ["07:00", "09:00", "12:00", "15:00", "18:00"],
      },
      {
        date: "2025-07-24",
        slots: ["07:00", "10:00", "14:00", "16:00"],
      },
    ],
  },
];

const HealthPractitionersMatching: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<
    "practitioners" | "scheduling" | "booking"
  >("practitioners");
  const [selectedService] = useState<Service>(mockServices[0]);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [selectedPractitioner, setSelectedPractitioner] =
    useState<Practitioner | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingForSelf, setBookingForSelf] = useState<boolean | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    relationship: "",
  });
  const [expandedPractitioner, setExpandedPractitioner] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate API fetch for practitioners
  useEffect(() => {
    const fetchPractitioners = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPractitioners(mockPractitioners);
      setLoading(false);
    };
    fetchPractitioners();
  }, []);

  const filteredPractitioners = practitioners.filter(
    (practitioner) =>
      practitioner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practitioner.specialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handlePractitionerSelect = (practitioner: Practitioner) => {
    setSelectedPractitioner(practitioner);
    setCurrentStep("scheduling");
  };

  const handleTimeSlotSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleProceedToBooking = () => {
    setCurrentStep("booking");
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Booking Details:", {
      selectedService,
      selectedPractitioner,
      selectedDate,
      selectedTime,
      bookingForSelf,
      bookingDetails,
    });

    // Here you would typically make the actual API call
    alert("Appointment booked successfully!");
    navigate("/patient/receipt");
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderPractitionerCard = (practitioner: Practitioner) => {
    const isExpanded = expandedPractitioner === practitioner.id;

    return (
      <div
        key={practitioner.id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-shrink-0 self-center sm:self-start">
              <img
                src={practitioner.profileImage}
                alt={practitioner.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              {practitioner.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 w-full min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-2 sm:space-y-0">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 flex-wrap">
                    <span className="truncate">{practitioner.name}</span>
                    {practitioner.isVerified && (
                      <Verified className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </h3>
                  <p className="text-green-600 font-medium text-sm sm:text-base">
                    {practitioner.title}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {practitioner.specialization}
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">
                      {practitioner.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({practitioner.reviewCount})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {practitioner.priceRange}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{practitioner.distance}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {practitioner.experience} experience
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {practitioner.completedCases} cases
                  </span>
                </div>
              </div>

              {/* Languages */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {practitioner.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {practitioner.services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {service}
                </span>
              ))}
              {practitioner.services.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  +{practitioner.services.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Response Time */}
          <div className="mt-3 text-sm text-green-600 flex items-center space-x-1">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="break-words">{practitioner.responseTime}</span>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {practitioner.bio}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Qualifications
                </h4>
                <div className="space-y-1">
                  {practitioner.qualifications.map((qual, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <BookOpen className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 break-words">
                        {qual}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  All Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {practitioner.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 pt-4 border-t border-gray-200 space-y-3 sm:space-y-0">
            <button
              onClick={() =>
                setExpandedPractitioner(isExpanded ? null : practitioner.id)
              }
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center sm:justify-start space-x-1"
            >
              <span>{isExpanded ? "Show Less" : "Show More"}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <div className="flex items-center justify-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePractitionerSelect(practitioner)}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex-shrink-0"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderScheduling = () => {
    if (!selectedPractitioner) return null;

    return (
      <div className="space-y-6">
        {/* Selected Practitioner Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <img
              src={selectedPractitioner.profileImage}
              alt={selectedPractitioner.name}
              className="w-12 h-12 rounded-full object-cover self-center sm:self-start flex-shrink-0"
            />
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h3 className="font-semibold text-gray-900 truncate">
                {selectedPractitioner.name}
              </h3>
              <p className="text-green-600">{selectedPractitioner.title}</p>
              <p className="text-sm text-gray-600">
                {selectedService.name} - {selectedService.duration}
              </p>
            </div>
            <div className="text-center sm:text-right flex-shrink-0">
              <p className="font-semibold text-green-600">
                ₦{selectedService.price.toLocaleString()}
              </p>
              <div className="flex items-center justify-center sm:justify-end space-x-1 text-sm">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{selectedPractitioner.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Date & Time
          </h3>

          <div className="space-y-4">
            {selectedPractitioner.availability.map((availability) => (
              <div
                key={availability.date}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
                  {formatDate(availability.date)}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {availability.slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() =>
                        handleTimeSlotSelect(availability.date, slot)
                      }
                      className={`p-2 sm:p-3 text-sm rounded-lg border transition-colors ${
                        selectedDate === availability.date &&
                        selectedTime === slot
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-300 hover:border-green-500 hover:bg-green-50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-start space-x-2 text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-medium text-sm sm:text-base break-words">
                  Selected: {formatDate(selectedDate)} at {selectedTime}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-3 sm:space-y-0">
            <button
              onClick={() => setCurrentStep("practitioners")}
              className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Practitioners</span>
            </button>

            <button
              onClick={handleProceedToBooking}
              disabled={!selectedDate || !selectedTime}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Continue to Booking
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBooking = () => {
    return (
      <div className="space-y-6">
        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Booking Summary
          </h3>

          <div className="space-y-3 text-sm sm:text-base">
            <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium break-words">
                {selectedService.name}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
              <span className="text-gray-600">Practitioner:</span>
              <span className="font-medium break-words">
                {selectedPractitioner?.name}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium break-words">
                {formatDate(selectedDate)} at {selectedTime}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{selectedService.duration}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-lg space-y-1 sm:space-y-0 pt-2 border-t border-gray-200">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-green-600">
                ₦{selectedService.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Booking For Self Question */}
        {bookingForSelf === null && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Who is this appointment for?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setBookingForSelf(true)}
                className="p-4 sm:p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
              >
                <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Myself</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Book this appointment for yourself
                </p>
              </button>

              <button
                onClick={() => setBookingForSelf(false)}
                className="p-4 sm:p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
              >
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Someone Else</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Book for a family member or friend
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Booking Details Form (if booking for someone else) */}
        {bookingForSelf === false && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Patient Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={bookingDetails.firstName}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={bookingDetails.lastName}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={bookingDetails.email}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={bookingDetails.phone}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  value={bookingDetails.address}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship to Patient *
                </label>
                <select
                  value={bookingDetails.relationship}
                  onChange={(e) =>
                    setBookingDetails((prev) => ({
                      ...prev,
                      relationship: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select relationship</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {bookingForSelf !== null && (
          <div className="flex justify-between">
            <button
              onClick={() => setBookingForSelf(null)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleBookingSubmit}
              disabled={
                loading ||
                (bookingForSelf === false &&
                  (!bookingDetails.firstName ||
                    !bookingDetails.lastName ||
                    !bookingDetails.email ||
                    !bookingDetails.phone ||
                    !bookingDetails.address ||
                    !bookingDetails.relationship))
              }
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Booking...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => {
                if (currentStep === "scheduling") {
                  setCurrentStep("practitioners");
                } else if (currentStep === "booking") {
                  setCurrentStep("scheduling");
                } else {
                  window.history.back();
                }
              }}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentStep === "practitioners" &&
                  "Available Healthcare Providers"}
                {currentStep === "scheduling" && "Schedule Appointment"}
                {currentStep === "booking" && "Complete Booking"}
              </h1>
              <p className="text-gray-600">
                {currentStep === "practitioners" &&
                  "Select from our verified healthcare providers"}
                {currentStep === "scheduling" &&
                  "Choose your preferred date and time"}
                {currentStep === "booking" &&
                  "Provide booking details to confirm your appointment"}
              </p>
            </div>
          </div>

          {currentStep === "practitioners" && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {currentStep === "practitioners" && (
            <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    Loading healthcare providers...
                  </p>
                </div>
              ) : filteredPractitioners.length > 0 ? (
                filteredPractitioners.map(renderPractitionerCard)
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No healthcare providers found
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === "scheduling" && renderScheduling()}
          {currentStep === "booking" && renderBooking()}
        </div>
      </div>
    </div>
  );
};

export default HealthPractitionersMatching;
