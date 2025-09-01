import {
  User,
  MapPin,
  Heart,
  Settings,
  AlertCircle,
  Save,
  ArrowLeft,
  Loader,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

interface ProfileFormData {
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

// Validation Schema
const validationSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .required("First name is required"),

  last_name: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .required("Last name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  phone_number: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),

  date_of_birth: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),

  gender: Yup.string().required("Gender is required"),

  blood_type: Yup.string()
    .oneOf(
      ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      "Invalid blood type"
    )
    .required("Blood type is required"),

  address: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),

  city: Yup.string()
    .min(2, "City must be at least 2 characters")
    .required("City is required"),

  state: Yup.string()
    .min(2, "State must be at least 2 characters")
    .required("State is required"),

  zipcode: Yup.string()
    .matches(/^\d{5,6}$/, "ZIP code must be 5-6 digits")
    .required("ZIP code is required"),

  medical_information: Yup.object({
    known_allergies: Yup.string(),
    current_medications: Yup.string(),
    medical_history: Yup.string(),
    primary_physician: Yup.string(),
  }),

  preferences: Yup.object({
    preferred_language: Yup.string()
      .oneOf(["en", "es", "fr", "other"])
      .required("Preferred language is required"),
    communication_preference: Yup.string()
      .oneOf(["email", "phone", "sms", "mail"])
      .required("Communication preference is required"),
    appointment_reminders: Yup.boolean(),
  }),

  emergency_contacts: Yup.array().of(
    Yup.object({
      name: Yup.string()
        .min(2, "Emergency contact name must be at least 2 characters")
        .required("Emergency contact name is required"),
      relationship: Yup.string()
        .oneOf(["spouse", "parent", "child", "sibling", "friend", "other"])
        .required("Relationship is required"),
      phone_number: Yup.string()
        .matches(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
        .min(10, "Phone number must be at least 10 digits")
        .required("Emergency contact phone number is required"),
    })
  ),
});

// Query key constant
const PROFILE_QUERY_KEY = ["user", "profile"];

// API functions
const fetchProfile = async (): Promise<ProfileFormData> => {
  try {
    const response = await api.get<ProfileFormData>("user/profile");
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

const updateProfile = async (
  profileData: ProfileFormData
): Promise<ProfileFormData> => {
  const response = await api.put<ProfileFormData>("user/profile", profileData);
  return response.data;
};

// Blood group options
const bloodGroupOptions = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

// Relationship options
const relationshipOptions = [
  { value: "spouse", label: "Spouse" },
  { value: "parent", label: "Parent" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Other" },
];

// Gender options
const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

// Language options
const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "other", label: "Other" },
];

// Communication preference options
const communicationOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "sms", label: "SMS" },
  { value: "mail", label: "Mail" },
];

const EditUserProfile: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "personal" | "medical" | "preferences"
  >("personal");

  // Query to fetch profile data
  const {
    data: profileData,
    isLoading: isFetchingProfile,
    isError: isFetchError,
  } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
    staleTime: 7 * 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 2,
  });

  // Mutation to update profile
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      navigate("/patient/profile");
    },
    onError: (error: any) => {
      console.error("Profile update failed:", error);
    },
  });

  const formik = useFormik<ProfileFormData>({
    initialValues: profileData || {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      date_of_birth: "",
      gender: "",
      blood_type: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      medical_information: {
        known_allergies: "",
        current_medications: "",
        medical_history: "",
        primary_physician: "",
      },
      preferences: {
        preferred_language: "en",
        communication_preference: "email",
        appointment_reminders: true,
      },
      emergency_contacts: [
        {
          name: "",
          relationship: "spouse",
          phone_number: "",
        },
      ],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      updateProfileMutation.mutate(values);
    },
  });

  const handleGoBack = () => {
    navigate("/patient/profile");
  };

  if (isFetchingProfile) {
    return (
      <div className="mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-green-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isFetchError) {
    return (
      <div className="mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
          <p className="mt-2 text-red-600">Failed to load profile data</p>
          <button
            onClick={handleGoBack}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "medical", name: "Medical Info", icon: Heart },
    { id: "preferences", name: "Preferences", icon: Settings },
  ];

  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Profile
                </h1>
                <p className="text-gray-600">
                  Update your personal and medical information
                </p>
              </div>
            </div>
            <div className="flex space-x-2 my-5 md:my-0 justify-center md:justify-end ">
              <button
                type="button"
                onClick={handleGoBack}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                type="submit"
                form="profile-form"
                disabled={updateProfileMutation.isPending}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfileMutation.isPending ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-scroll">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <form id="profile-form" onSubmit={formik.handleSubmit}>
            {activeTab === "personal" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formik.values.first_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.first_name && formik.errors.first_name
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.first_name && formik.errors.first_name && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.first_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formik.values.last_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.last_name && formik.errors.last_name
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.last_name && formik.errors.last_name && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.last_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone_number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={formik.values.phone_number}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.phone_number &&
                        formik.errors.phone_number
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.phone_number &&
                      formik.errors.phone_number && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.phone_number}
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="date_of_birth"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={formik.values.date_of_birth}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.date_of_birth &&
                        formik.errors.date_of_birth
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.date_of_birth &&
                      formik.errors.date_of_birth && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.date_of_birth}
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.gender && formik.errors.gender
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formik.touched.gender && formik.errors.gender && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.gender}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="blood_type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Blood Type *
                    </label>
                    <select
                      id="blood_type"
                      name="blood_type"
                      value={formik.values.blood_type}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.blood_type && formik.errors.blood_type
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Blood Type</option>
                      {bloodGroupOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formik.touched.blood_type && formik.errors.blood_type && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.blood_type}
                      </p>
                    )}
                  </div>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.address && formik.errors.address
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.address && formik.errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.city && formik.errors.city
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.city && formik.errors.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.state && formik.errors.state
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.state && formik.errors.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="zipcode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipcode"
                      name="zipcode"
                      value={formik.values.zipcode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.zipcode && formik.errors.zipcode
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.zipcode && formik.errors.zipcode && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.zipcode}
                      </p>
                    )}
                  </div>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Emergency Contact
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="emergency_contacts[0].name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Emergency Contact Name *
                    </label>
                    <input
                      type="text"
                      id="emergency_contacts[0].name"
                      name="emergency_contacts[0].name"
                      value={formik.values.emergency_contacts[0]?.name || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 `}
                    />
                    {formik.touched.emergency_contacts?.[0]?.name &&
                      typeof formik.errors.emergency_contacts?.[0] ===
                        "object" &&
                      "name" in formik.errors.emergency_contacts[0] && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            (
                              formik.errors
                                .emergency_contacts[0] as EmergencyContact
                            ).name
                          }
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="emergency_contacts[0].phone_number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Emergency Phone *
                    </label>
                    <input
                      type="tel"
                      id="emergency_contacts[0].phone_number"
                      name="emergency_contacts[0].phone_number"
                      value={
                        formik.values.emergency_contacts[0]?.phone_number || ""
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 `}
                    />
                    {formik.touched.emergency_contacts?.[0]?.phone_number &&
                      typeof formik.errors.emergency_contacts?.[0] ===
                        "object" &&
                      "phone_number" in formik.errors.emergency_contacts[0] && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            (
                              formik.errors
                                .emergency_contacts[0] as EmergencyContact
                            ).phone_number
                          }
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="emergency_contacts[0].relationship"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Relationship *
                    </label>
                    <select
                      id="emergency_contacts[0].relationship"
                      name="emergency_contacts[0].relationship"
                      value={
                        formik.values.emergency_contacts[0]?.relationship ||
                        "spouse"
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 `}
                    >
                      {relationshipOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formik.touched.emergency_contacts?.[0]?.relationship &&
                      typeof formik.errors.emergency_contacts?.[0] ===
                        "object" &&
                      "relationship" in formik.errors.emergency_contacts[0] && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            (
                              formik.errors
                                .emergency_contacts[0] as EmergencyContact
                            ).relationship
                          }
                        </p>
                      )}
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
                  <div>
                    <label
                      htmlFor="medical_information.known_allergies"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Known Allergies
                    </label>
                    <textarea
                      id="medical_information.known_allergies"
                      name="medical_information.known_allergies"
                      rows={3}
                      value={formik.values.medical_information.known_allergies}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="List any known allergies (e.g., medications, foods, environmental)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    {formik.touched.medical_information?.known_allergies &&
                      formik.errors.medical_information?.known_allergies && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.medical_information.known_allergies}
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="medical_information.current_medications"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Current Medications
                    </label>
                    <textarea
                      id="medical_information.current_medications"
                      name="medical_information.current_medications"
                      rows={3}
                      value={
                        formik.values.medical_information.current_medications
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="List all current medications including dosage and frequency"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    {formik.touched.medical_information?.current_medications &&
                      formik.errors.medical_information
                        ?.current_medications && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            formik.errors.medical_information
                              .current_medications
                          }
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="medical_information.medical_history"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Medical History
                    </label>
                    <textarea
                      id="medical_information.medical_history"
                      name="medical_information.medical_history"
                      rows={4}
                      value={formik.values.medical_information.medical_history}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Describe any significant medical history, previous surgeries, chronic conditions, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    {formik.touched.medical_information?.medical_history &&
                      formik.errors.medical_information?.medical_history && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.medical_information.medical_history}
                        </p>
                      )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="medical_information.primary_physician"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Primary Physician
                      </label>
                      <input
                        type="text"
                        id="medical_information.primary_physician"
                        name="medical_information.primary_physician"
                        value={
                          formik.values.medical_information.primary_physician
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Dr. John Smith"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      {formik.touched.medical_information?.primary_physician &&
                        formik.errors.medical_information
                          ?.primary_physician && (
                          <p className="mt-1 text-sm text-red-600">
                            {
                              formik.errors.medical_information
                                .primary_physician
                            }
                          </p>
                        )}
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
                  <div>
                    <label
                      htmlFor="preferences.preferred_language"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preferred Language *
                    </label>
                    <select
                      id="preferences.preferred_language"
                      name="preferences.preferred_language"
                      value={formik.values.preferences.preferred_language}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.preferences?.preferred_language &&
                        formik.errors.preferences?.preferred_language
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    >
                      {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formik.touched.preferences?.preferred_language &&
                      formik.errors.preferences?.preferred_language && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.preferences.preferred_language}
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="preferences.communication_preference"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Communication Preference *
                    </label>
                    <select
                      id="preferences.communication_preference"
                      name="preferences.communication_preference"
                      value={formik.values.preferences.communication_preference}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formik.touched.preferences?.communication_preference &&
                        formik.errors.preferences?.communication_preference
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    >
                      {communicationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formik.touched.preferences?.communication_preference &&
                      formik.errors.preferences?.communication_preference && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.preferences.communication_preference}
                        </p>
                      )}
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="preferences.appointment_reminders"
                        name="preferences.appointment_reminders"
                        checked={
                          formik.values.preferences.appointment_reminders
                        }
                        onChange={formik.handleChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="preferences.appointment_reminders"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Enable appointment reminders
                      </label>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Receive reminders about upcoming appointments via your
                      preferred communication method.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {updateProfileMutation.isError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error updating profile
                    </h3>
                    <p className="mt-2 text-sm text-red-700">
                      {updateProfileMutation.error?.message ||
                        "An unexpected error occurred. Please try again."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserProfile;
