import {
  User,
  MapPin,
  Heart,
  Edit,
  AlertCircle,
  Settings,
  Loader,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  blood_type: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  medical_information: MedicalInformation;
  preferences: Preferences;
  emergency_contacts: EmergencyContact[];
  profile_picture: string;
}

type TabId = "personal" | "medical" | "preferences";

interface Tab {
  id: TabId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PROFILE_QUERY_KEY = ["user", "profile"];

const fetchProfile = async () => {
  try {
    const response = await api.get<ProfileData>("user/profile");
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};

const PatientProfile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("personal");

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
    navigate("/patient/profile/edit");
  };

  const tabs: Tab[] = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "medical", name: "Medical Info", icon: Heart },
    { id: "preferences", name: "Preferences", icon: Settings },
  ];

  const formatRelationship = (relationship: string): string => {
    return relationship.charAt(0).toUpperCase() + relationship.slice(1);
  };

  const formatLanguage = (lang: string): string => {
    const languages = {
      en: "English",
      es: "Spanish",
      fr: "French",
      other: "Other",
    };
    return languages[lang as keyof typeof languages] || lang;
  };

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
      <div className="patient-theme mx-auto bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-10 w-10 text-primary-600 mx-auto" />
          <p className="mt-3 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="patient-theme mx-auto bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load profile
          </p>
          <p className="text-sm text-gray-600 mb-4">
            We couldn't retrieve your profile data. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="btn-primary px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
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
    <div className="patient-theme mx-auto bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen pb-8">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <img src={profileData.profile_picture} alt={`${profileData.first_name} ${profileData.last_name}`} className="w-24 h-24 rounded-full object-cover" />
            </div>
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-sm hover:shadow-md"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* Profile Picture Section */}
          {/* <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center ring-4 ring-primary-100 ring-offset-2 shadow-sm">
                <User className="w-12 h-12 text-primary-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profileData.first_name} {profileData.last_name}
              </h2>
              
              <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-emerald-50 rounded-full w-fit">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-emerald-700">
                  Active Patient
                </span>
              </div>
            </div>
          </div> */}

          {/* Quick Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 rounded-xl border border-primary-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Age</p>
                  <p className="text-lg font-bold text-gray-900">
                    {calculateAge(profileData.date_of_birth)} years
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Blood Type
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {profileData.blood_type || "Not set"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Last Visit
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    Dec 15, 2024
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Records</p>
                  <p className="text-lg font-bold text-gray-900">24 entries</p>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 bg-gray-50/50">
          <nav className="flex space-x-1 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary-600 border-b-3 border-primary-600 bg-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-t-lg"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl mt-5 shadow-sm border border-gray-100">
        <div className="p-6">
          {activeTab === "personal" && (
            <div>
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    First Name
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.first_name || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Last Name
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.last_name || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Email Address
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.email_address || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Phone Number
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.phone_number || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Date of Birth
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.date_of_birth || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Gender
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.gender || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Blood Type
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.blood_type || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-10 mb-6 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  Address Information
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Street Address
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.address || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    City
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.city || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    State
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.state || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    ZIP Code
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.zipcode || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-10 mb-6 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  Emergency Contact
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Contact Name
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.emergency_contacts[0]?.name || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Phone Number
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.emergency_contacts[0]?.phone_number ||
                      "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Relationship
                  </label>
                  <p className="text-gray-900 font-medium text-base">
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
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Medical Information
                </h3>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Known Allergies
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 font-medium text-base whitespace-pre-wrap">
                      {profileData.medical_information.known_allergies ||
                        "No known allergies"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Current Medications
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 font-medium text-base whitespace-pre-wrap">
                      {profileData.medical_information.current_medications ||
                        "No current medications"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Medical History
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 font-medium text-base whitespace-pre-wrap">
                      {profileData.medical_information.medical_history ||
                        "No medical history recorded"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Primary Physician
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {profileData.medical_information.primary_physician ||
                      "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div>
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Preferences & Settings
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Preferred Language
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {formatLanguage(profileData.preferences.preferred_language)}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Communication Preference
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    {formatCommunicationPreference(
                      profileData.preferences.communication_preference
                    )}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Appointment Reminders
                  </label>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${
                      profileData.preferences.appointment_reminders
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {profileData.preferences.appointment_reminders
                      ? "Enabled"
                      : "Disabled"}
                  </div>
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
