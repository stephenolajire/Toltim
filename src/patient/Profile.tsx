import {
  User,
  MapPin,
  Calendar,
  Heart,
  Edit,
  AlertCircle,
  Clock,
  FileText,
  Activity,
  Settings,
  Loader,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // Add this import
import api from "../constant/api";
import { useState } from "react";

interface MedicalInformation {
  known_allergies: string;
  current_medications: string;
  medical_history: string;
  primary_physician: string;
}

interface Preferences {
  preferred_language: "en" | "es" | "fr" | "other";
  communication_preference: "email" | "phone" | "sms" | "mail";
  appointment_reminders: boolean;
}

interface EmergencyContact {
  name: string;
  relationship: "spouse" | "parent" | "child" | "sibling" | "friend" | "other";
  phone_number: string;
}

interface ProfileData {
  // Personal Information
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  blood_type: string;

  // Contact Information
  address: string;
  city: string;
  state: string;
  zipcode: string;

  // Medical Information
  medical_information: MedicalInformation;

  // Preferences
  preferences: Preferences;

  // Emergency Contacts
  emergency_contacts: EmergencyContact[];
}

type TabId = "personal" | "medical" | "preferences";

interface Tab {
  id: TabId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Query key constant
const PROFILE_QUERY_KEY = ["user", "profile"];

// API function for fetching profile
const fetchProfile = async (): Promise<ProfileData> => {
  try {
    const response = await api.get<ProfileData>("user/profile");
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Return mock data if profile not found
      return {
        first_name: "John",
        last_name: "Doe",
        email_address: "john.doe@example.com",
        phone_number: "+234...",
        date_of_birth: "1990-01-01",
        gender: "Male",
        blood_type: "O+",
        address: "123 Main St",
        city: "Lagos",
        state: "Lagos",
        zipcode: "100001",
        medical_information: {
          known_allergies: "None",
          current_medications: "None",
          medical_history: "No significant history",
          primary_physician: "Dr. Smith",
        },
        preferences: {
          preferred_language: "en",
          communication_preference: "email",
          appointment_reminders: true,
        },
        emergency_contacts: [
          {
            name: "Jane Doe",
            relationship: "spouse",
            phone_number: "+234...",
          },
        ],
      };
    }
    throw error;
  }
};

const PatientProfile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  // Query to fetch profile data
  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
    staleTime: 7 * 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const handleEditProfile = () => {
    // Navigate to edit profile component
    navigate("/patient/profile/edit");
  };

  const tabs: Tab[] = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "medical", name: "Medical Info", icon: Heart },
    { id: "preferences", name: "Preferences", icon: Settings },
  ];

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Helper function to format relationship
  const formatRelationship = (relationship: string): string => {
    return relationship.charAt(0).toUpperCase() + relationship.slice(1);
  };

  // Helper function to format language
  const formatLanguage = (lang: string): string => {
    const languages = {
      en: "English",
      es: "Spanish",
      fr: "French",
      other: "Other",
    };
    return languages[lang as keyof typeof languages] || lang;
  };

  // Helper function to format communication preference
  const formatCommunicationPreference = (pref: string): string => {
    const preferences = {
      email: "Email",
      phone: "Phone",
      sms: "SMS",
      mail: "Mail",
    };
    return preferences[pref as keyof typeof preferences] || pref;
  };

  if (isLoading) {
    return (
      <div className="mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-green-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
          <p className="mt-2 text-red-600">Failed to load profile data</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 mb-4 ">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Patient Profile
                </h1>
                <p className="text-gray-600">
                  View your personal and medical information
                </p>
              </div>
            </div>
            <div className="flex space-x-2 md:justify-end justify-center md:my-0 my-4">
              <button
                onClick={handleEditProfile}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="flex items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {profileData.first_name} {profileData.last_name}
              </h2>
              <p className="text-gray-600">Patient ID: PAT-2024-001</p>
              <div className="flex items-center mt-2">
                <Activity className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">Active Patient</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold text-gray-900">
                    {calculateAge(profileData.date_of_birth)} years
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Blood Type</p>
                  <p className="font-semibold text-gray-900">
                    {profileData.blood_type || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Last Visit</p>
                  <p className="font-semibold text-gray-900">Dec 15, 2024</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-orange-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Records</p>
                  <p className="font-semibold text-gray-900">24 entries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-scroll">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          {activeTab === "personal" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.first_name || "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.last_name || "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.email_address || "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.phone_number || "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.date_of_birth || "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.gender || "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Type
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.blood_type || "Not specified"}
                  </p>
                </div>
              </div>

              <h4 className="text-md font-semibold text-gray-900 mt-8 mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.address || "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.city || "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.state || "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.zipcode || "Not specified"}
                  </p>
                </div>
              </div>

              <h4 className="text-md font-semibold text-gray-900 mt-8 mb-4 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Name
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.emergency_contacts[0]?.name || "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Phone
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.emergency_contacts[0]?.phone_number ||
                      "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <p className="text-gray-900 py-2">
                    {formatRelationship(
                      profileData.emergency_contacts[0]?.relationship ||
                        "Not specified"
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "medical" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Medical Information
              </h3>
              <div className="space-y-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Known Allergies
                  </label>
                  <p className="text-gray-900 py-2 whitespace-pre-wrap">
                    {profileData.medical_information.known_allergies ||
                      "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Medications
                  </label>
                  <p className="text-gray-900 py-2 whitespace-pre-wrap">
                    {profileData.medical_information.current_medications ||
                      "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical History
                  </label>
                  <p className="text-gray-900 py-2 whitespace-pre-wrap">
                    {profileData.medical_information.medical_history ||
                      "Not specified"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Physician
                    </label>
                    <p className="text-gray-900 py-2">
                      {profileData.medical_information.primary_physician ||
                        "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Preferences & Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Language
                  </label>
                  <p className="text-gray-900 py-2">
                    {formatLanguage(profileData.preferences.preferred_language)}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Communication Preference
                  </label>
                  <p className="text-gray-900 py-2">
                    {formatCommunicationPreference(
                      profileData.preferences.communication_preference
                    )}
                  </p>
                </div>
                <div className="md:col-span-2 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Reminders
                  </label>
                  <p className="text-gray-900 py-2">
                    {profileData.preferences.appointment_reminders
                      ? "Enabled"
                      : "Disabled"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
