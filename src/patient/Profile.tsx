import {
  User,
  MapPin,
  Calendar,
  Heart,
  Edit,
  Save,
  X,
  Camera,
  AlertCircle,
  Clock,
  FileText,
  Activity,
  Settings,
  Loader,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../constant/api";

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
  email: string;
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

interface InputFieldProps {
  label: string;
  field: string;
  type?: "text" | "email" | "tel" | "date" | "select" | "textarea" | "checkbox";
  required?: boolean;
  value: any;
  onChange: (value: any) => void;
  options?: { value: string; label: string }[];
}

// Query key constant
const PROFILE_QUERY_KEY = ["user", "profile"];

// API functions
// Update the fetchProfile function
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
        email: "john.doe@example.com",
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
          primary_physician: "Dr. Smith"
        },
        preferences: {
          preferred_language: "en",
          communication_preference: "email",
          appointment_reminders: true
        },
        emergency_contacts: [{
          name: "Jane Doe",
          relationship: "spouse",
          phone_number: "+234..."
        }]
      };
    }
    throw error;
  }
};

const updateProfile = async (
  profileData: Partial<ProfileData>
): Promise<ProfileData> => {
  const updateData = {
    medical_information: profileData.medical_information,
    preferences: profileData.preferences,
    emergency_contacts: profileData.emergency_contacts,
    date_of_birth: profileData.date_of_birth,
    gender: profileData.gender,
    blood_type: profileData.blood_type,
    address: profileData.address,
    city: profileData.city,
    state: profileData.state,
    zipcode: profileData.zipcode,
  };

  const response = await api.patch("user/profile", updateData);
  return response.data;
};

const PatientProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [profileData, setProfileData] = useState<ProfileData>({
    // Personal Information
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
    blood_type: "",

    // Contact Information
    address: "",
    city: "",
    state: "",
    zipcode: "",

    // Medical Information
    medical_information: {
      known_allergies: "",
      current_medications: "",
      medical_history: "",
      primary_physician: "",
    },

    // Preferences
    preferences: {
      preferred_language: "en",
      communication_preference: "email",
      appointment_reminders: true,
    },

    // Emergency Contacts
    emergency_contacts: [
      {
        name: "",
        relationship: "spouse",
        phone_number: "",
      },
    ],
  });

  const queryClient = useQueryClient();

  // Query to fetch profile data
const {
  data: fetchedProfileData,
  isLoading,
  isError,
} = useQuery({
  queryKey: PROFILE_QUERY_KEY,
  queryFn: fetchProfile,
  staleTime: 7 * 24 * 60 * 60 * 1000,
  gcTime: 7 * 24 * 60 * 60 * 1000,
  retry: 2,
  refetchOnWindowFocus: false,
});

  // Mutation to update profile data
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedData);
      setIsEditing(false);
    },
    onError: (error: Error) => {
      console.error("Profile update failed:", error);
    },
  });

  // Initialize profileData when fetchedProfileData is available
  useEffect(() => {
    if (fetchedProfileData && Object.keys(fetchedProfileData).length > 0) {
      setProfileData((prev) => ({
        ...prev,
        ...fetchedProfileData,
      }));
    }
  }, [fetchedProfileData]);

  const handleNestedChange = (path: string, value: any) => {
    setProfileData((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (keys[i].includes("[") && keys[i].includes("]")) {
          const [key, indexStr] = keys[i].split("[");
          const index = parseInt(indexStr.replace("]", ""));
          current = current[key][index];
        } else {
          current = current[keys[i]];
        }
      }

      const lastKey = keys[keys.length - 1];
      if (lastKey.includes("[") && lastKey.includes("]")) {
        const [key, indexStr] = lastKey.split("[");
        const index = parseInt(indexStr.replace("]", ""));
        current[key][index] = value;
      } else {
        current[lastKey] = value;
      }

      return newData;
    });
  };

  const handleSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to the original data from cache
    if (fetchedProfileData) {
      setProfileData(fetchedProfileData);
    }
  };

  const tabs: Tab[] = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "medical", name: "Medical Info", icon: Heart },
    { id: "preferences", name: "Preferences", icon: Settings },
  ];

  const InputField: React.FC<InputFieldProps> = ({
    label,
    type = "text",
    required = false,
    value,
    onChange,
    options = [],
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isEditing ? (
        type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        ) : type === "checkbox" ? (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              className="mr-2 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-600">
              Enable appointment reminders
            </span>
          </label>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        )
      ) : (
        <p className="text-gray-900 py-2">
          {type === "checkbox"
            ? value
              ? "Enabled"
              : "Disabled"
            : value || "Not specified"}
        </p>
      )}
    </div>
  );

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
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
            }
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
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
                  Manage your personal and medical information
                </p>
              </div>
            </div>
            <div className="flex space-x-2 md:justify-end justify-center md:my-0 my-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className={`flex items-center px-4 py-2 text-white rounded-md transition-colors ${
                      updateProfileMutation.isPending
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader className="animate-spin w-4 h-4 mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Status Messages */}
          {updateProfileMutation.isSuccess && (
            <div className="mb-4 p-3 rounded-lg flex items-center bg-green-50 border border-green-200 text-green-700">
              <CheckCircle className="text-green-600 text-lg mr-2 flex-shrink-0" />
              <p className="text-sm">Profile updated successfully!</p>
            </div>
          )}

          {updateProfileMutation.isError && (
            <div className="mb-4 p-3 rounded-lg flex items-center bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="text-red-600 text-lg mr-2 flex-shrink-0" />
              <p className="text-sm">
                {(updateProfileMutation.error as any)?.response?.data
                  ?.message || "Failed to update profile. Please try again."}
              </p>
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="flex items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-green-600" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
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
                  <p className="font-semibold text-gray-900">39 years</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Blood Type</p>
                  <p className="font-semibold text-gray-900">
                    {profileData.blood_type}
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
                <InputField
                  label="First Name"
                  field="first_name"
                  required
                  value={profileData.first_name}
                  onChange={(value) => handleNestedChange("first_name", value)}
                />
                <InputField
                  label="Last Name"
                  field="last_name"
                  required
                  value={profileData.last_name}
                  onChange={(value) => handleNestedChange("last_name", value)}
                />
                <InputField
                  label="Email Address"
                  field="email"
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(value) => handleNestedChange("email", value)}
                />
                <InputField
                  label="Phone Number"
                  field="phone_number"
                  type="tel"
                  required
                  value={profileData.phone_number}
                  onChange={(value) =>
                    handleNestedChange("phone_number", value)
                  }
                />
                <InputField
                  label="Date of Birth"
                  field="date_of_birth"
                  type="date"
                  required
                  value={profileData.date_of_birth}
                  onChange={(value) =>
                    handleNestedChange("date_of_birth", value)
                  }
                />
                <InputField
                  label="Gender"
                  field="gender"
                  type="select"
                  value={profileData.gender}
                  onChange={(value) => handleNestedChange("gender", value)}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                    { value: "Prefer not to say", label: "Prefer not to say" },
                  ]}
                />
                <InputField
                  label="Blood Type"
                  field="blood_type"
                  type="select"
                  value={profileData.blood_type}
                  onChange={(value) => handleNestedChange("blood_type", value)}
                  options={[
                    { value: "A+", label: "A+" },
                    { value: "A-", label: "A-" },
                    { value: "B+", label: "B+" },
                    { value: "B-", label: "B-" },
                    { value: "AB+", label: "AB+" },
                    { value: "AB-", label: "AB-" },
                    { value: "O+", label: "O+" },
                    { value: "O-", label: "O-" },
                  ]}
                />
              </div>

              <h4 className="text-md font-semibold text-gray-900 mt-8 mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InputField
                    label="Street Address"
                    field="address"
                    required
                    value={profileData.address}
                    onChange={(value) => handleNestedChange("address", value)}
                  />
                </div>
                <InputField
                  label="City"
                  field="city"
                  required
                  value={profileData.city}
                  onChange={(value) => handleNestedChange("city", value)}
                />
                <InputField
                  label="State"
                  field="state"
                  required
                  value={profileData.state}
                  onChange={(value) => handleNestedChange("state", value)}
                />
                <InputField
                  label="ZIP Code"
                  field="zipcode"
                  required
                  value={profileData.zipcode}
                  onChange={(value) => handleNestedChange("zipcode", value)}
                />
              </div>

              <h4 className="text-md font-semibold text-gray-900 mt-8 mb-4 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Emergency Contact Name"
                  field="emergency_contacts[0].name"
                  required
                  value={profileData.emergency_contacts[0]?.name || ""}
                  onChange={(value) =>
                    handleNestedChange("emergency_contacts[0].name", value)
                  }
                />
                <InputField
                  label="Emergency Phone"
                  field="emergency_contacts[0].phone_number"
                  type="tel"
                  required
                  value={profileData.emergency_contacts[0]?.phone_number || ""}
                  onChange={(value) =>
                    handleNestedChange(
                      "emergency_contacts[0].phone_number",
                      value
                    )
                  }
                />
                <InputField
                  label="Relationship"
                  field="emergency_contacts[0].relationship"
                  type="select"
                  required
                  value={
                    profileData.emergency_contacts[0]?.relationship || "spouse"
                  }
                  onChange={(value) =>
                    handleNestedChange(
                      "emergency_contacts[0].relationship",
                      value
                    )
                  }
                  options={[
                    { value: "spouse", label: "Spouse" },
                    { value: "parent", label: "Parent" },
                    { value: "child", label: "Child" },
                    { value: "sibling", label: "Sibling" },
                    { value: "friend", label: "Friend" },
                    { value: "other", label: "Other" },
                  ]}
                />
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
                <InputField
                  label="Known Allergies"
                  field="medical_information.known_allergies"
                  type="textarea"
                  value={profileData.medical_information.known_allergies}
                  onChange={(value) =>
                    handleNestedChange(
                      "medical_information.known_allergies",
                      value
                    )
                  }
                />
                <InputField
                  label="Current Medications"
                  field="medical_information.current_medications"
                  type="textarea"
                  value={profileData.medical_information.current_medications}
                  onChange={(value) =>
                    handleNestedChange(
                      "medical_information.current_medications",
                      value
                    )
                  }
                />
                <InputField
                  label="Medical History"
                  field="medical_information.medical_history"
                  type="textarea"
                  value={profileData.medical_information.medical_history}
                  onChange={(value) =>
                    handleNestedChange(
                      "medical_information.medical_history",
                      value
                    )
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Primary Physician"
                    field="medical_information.primary_physician"
                    value={profileData.medical_information.primary_physician}
                    onChange={(value) =>
                      handleNestedChange(
                        "medical_information.primary_physician",
                        value
                      )
                    }
                  />
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
                <InputField
                  label="Preferred Language"
                  field="preferences.preferred_language"
                  type="select"
                  value={profileData.preferences.preferred_language}
                  onChange={(value) =>
                    handleNestedChange("preferences.preferred_language", value)
                  }
                  options={[
                    { value: "en", label: "English" },
                    { value: "es", label: "Spanish" },
                    { value: "fr", label: "French" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <InputField
                  label="Communication Preference"
                  field="preferences.communication_preference"
                  type="select"
                  value={profileData.preferences.communication_preference}
                  onChange={(value) =>
                    handleNestedChange(
                      "preferences.communication_preference",
                      value
                    )
                  }
                  options={[
                    { value: "email", label: "Email" },
                    { value: "phone", label: "Phone" },
                    { value: "sms", label: "SMS" },
                    { value: "mail", label: "Mail" },
                  ]}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Appointment Reminders"
                    field="preferences.appointment_reminders"
                    type="checkbox"
                    value={profileData.preferences.appointment_reminders}
                    onChange={(value) =>
                      handleNestedChange(
                        "preferences.appointment_reminders",
                        value
                      )
                    }
                  />
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
