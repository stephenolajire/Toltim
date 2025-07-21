import {
  User,
  MapPin,
  Calendar,
  Heart,
  Shield,
  Edit,
  Save,
  X,
  Camera,
  AlertCircle,
  Clock,
  FileText,
  Activity,
  Settings,
} from "lucide-react";
import { useState } from "react";

interface ProfileData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other" | "Prefer not to say";
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

  // Contact Information
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  relationship: "Spouse" | "Parent" | "Child" | "Sibling" | "Friend" | "Other";

  // Medical Information
  allergies: string;
  medications: string;
  medicalHistory: string;
  primaryPhysician: string;
  insuranceProvider: string;
  policyNumber: string;

  // Preferences
  preferredLanguage: "English" | "Spanish" | "French" | "Other";
  communicationPreference: "Email" | "Phone" | "SMS" | "Mail";
  appointmentReminders: boolean;
}

type TabId = "personal" | "medical" | "insurance" | "preferences";

interface Tab {
  id: TabId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface InputFieldProps {
  label: string;
  field: keyof ProfileData;
  type?: "text" | "email" | "tel" | "date" | "select" | "textarea" | "checkbox";
  required?: boolean;
}

const PatientProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [profileData, setProfileData] = useState<ProfileData>({
    // Personal Information
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-03-15",
    gender: "Male",
    bloodType: "O+",

    // Contact Information
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 (555) 987-6543",
    relationship: "Spouse",

    // Medical Information
    allergies: "Penicillin, Shellfish",
    medications: "Lisinopril 10mg daily, Metformin 500mg twice daily",
    medicalHistory: "Hypertension (2018), Type 2 Diabetes (2020)",
    primaryPhysician: "Dr. Sarah Johnson",
    insuranceProvider: "Blue Cross Blue Shield",
    policyNumber: "BC123456789",

    // Preferences
    preferredLanguage: "English",
    communicationPreference: "Email",
    appointmentReminders: true,
  });

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | boolean
  ): void => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (): void => {
    setIsEditing(false);
    // Here you would typically save to a backend
    console.log("Saving profile data:", profileData);
  };

  const tabs: Tab[] = [
    { id: "personal", name: "PersonalInfo", icon: User },
    { id: "medical", name: "MedicalInfo", icon: Heart },
    // { id: "insurance", name: "Insurance", icon: Shield },
    { id: "preferences", name: "Preferences", icon: Settings },
  ];

  const InputField: React.FC<InputFieldProps> = ({
    label,
    field,
    type = "text",
    required = false,
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isEditing ? (
        type === "select" ? (
          <select
            value={profileData[field] as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            {field === "gender" && (
              <>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </>
            )}
            {field === "bloodType" && (
              <>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </>
            )}
            {field === "relationship" && (
              <>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </>
            )}
            {field === "preferredLanguage" && (
              <>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Other">Other</option>
              </>
            )}
            {field === "communicationPreference" && (
              <>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="SMS">SMS</option>
                <option value="Mail">Mail</option>
              </>
            )}
          </select>
        ) : type === "textarea" ? (
          <textarea
            value={profileData[field] as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        ) : type === "checkbox" ? (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={profileData[field] as boolean}
              onChange={(e) => handleInputChange(field, e.target.checked)}
              className="mr-2 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-600">
              Enable appointment reminders
            </span>
          </label>
        ) : (
          <input
            type={type}
            value={profileData[field] as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        )
      ) : (
        <p className="text-gray-900 py-2">
          {type === "checkbox"
            ? profileData[field]
              ? "Enabled"
              : "Disabled"
            : (profileData[field] as string) || "Not specified"}
        </p>
      )}
    </div>
  );

  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
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
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
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
                {profileData.firstName} {profileData.lastName}
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
                    {profileData.bloodType}
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
                <InputField label="First Name" field="firstName" required />
                <InputField label="Last Name" field="lastName" required />
                <InputField
                  label="Email Address"
                  field="email"
                  type="email"
                  required
                />
                <InputField
                  label="Phone Number"
                  field="phone"
                  type="tel"
                  required
                />
                <InputField
                  label="Date of Birth"
                  field="dateOfBirth"
                  type="date"
                  required
                />
                <InputField label="Gender" field="gender" type="select" />
                <InputField
                  label="Blood Type"
                  field="bloodType"
                  type="select"
                />
              </div>

              <h4 className="text-md font-semibold text-gray-900 mt-8 mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InputField label="Street Address" field="address" required />
                </div>
                <InputField label="City" field="city" required />
                <InputField label="State" field="state" required />
                <InputField label="ZIP Code" field="zipCode" required />
              </div>

              <h4 className="text-md font-semibold text-gray-900 mt-8 mb-4 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Emergency Contact Name"
                  field="emergencyContact"
                  required
                />
                <InputField
                  label="Emergency Phone"
                  field="emergencyPhone"
                  type="tel"
                  required
                />
                <InputField
                  label="Relationship"
                  field="relationship"
                  type="select"
                  required
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
                  field="allergies"
                  type="textarea"
                />
                <InputField
                  label="Current Medications"
                  field="medications"
                  type="textarea"
                />
                <InputField
                  label="Medical History"
                  field="medicalHistory"
                  type="textarea"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Primary Physician"
                    field="primaryPhysician"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "insurance" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Insurance Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Insurance Provider"
                  field="insuranceProvider"
                  required
                />
                <InputField
                  label="Policy Number"
                  field="policyNumber"
                  required
                />
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
                  field="preferredLanguage"
                  type="select"
                />
                <InputField
                  label="Communication Preference"
                  field="communicationPreference"
                  type="select"
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Appointment Reminders"
                    field="appointmentReminders"
                    type="checkbox"
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
