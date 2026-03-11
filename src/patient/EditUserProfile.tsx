import {
  User,
  MapPin,
  Heart,
  Settings,
  AlertCircle,
  Save,
  ArrowLeft,
  ArrowRight,
  Loader,
  Upload,
  X,
  Check,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../constant/api";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

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

interface ApiProfileData {
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  blood_type: string;
  profile_picture?: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  nin: string | null;
  medical_information: MedicalInformation;
  preferences: Preferences;
  emergency_contact: EmergencyContact;
}

interface ProfileFormData {
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  blood_type: string;
  profile_picture?: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  medical_information: MedicalInformation;
  preferences: Preferences;
  emergency_contact: EmergencyContact;
}

type TabId = "personal" | "medical" | "preferences";

const TAB_ORDER: TabId[] = ["personal", "medical", "preferences"];

const TAB_REQUIRED_FIELDS: Record<TabId, string[]> = {
  personal: [
    "first_name",
    "last_name",
    "phone_number",
    "date_of_birth",
    "gender",
    "blood_type",
    "address",
    "city",
    "state",
    "zipcode",
    "emergency_contact.name",
    "emergency_contact.relationship",
    "emergency_contact.phone_number",
  ],
  medical: [],
  preferences: [
    "preferences.preferred_language",
    "preferences.communication_preference",
  ],
};

const getNestedValue = (obj: any, path: string): any =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

const hasTabErrors = (errors: any, tabId: TabId): boolean =>
  TAB_REQUIRED_FIELDS[tabId].some((field) => {
    const keys = field.split(".");
    if (keys.length === 1) return !!errors[keys[0]];
    if (keys.length === 2) return !!errors[keys[0]]?.[keys[1]];
    return false;
  });

const isTabComplete = (values: ProfileFormData, tabId: TabId): boolean => {
  const fields = TAB_REQUIRED_FIELDS[tabId];
  if (fields.length === 0) return true;
  return fields.every((field) => {
    const val = getNestedValue(values, field);
    return val !== undefined && val !== null && String(val).trim() !== "";
  });
};

const touchTabFields = (tabId: TabId): Record<string, any> => {
  const touched: Record<string, any> = {};
  TAB_REQUIRED_FIELDS[tabId].forEach((field) => {
    const keys = field.split(".");
    if (keys.length === 1) {
      touched[keys[0]] = true;
    } else if (keys.length === 2) {
      if (!touched[keys[0]]) touched[keys[0]] = {};
      touched[keys[0]][keys[1]] = true;
    }
  });
  return touched;
};

const validationSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "At least 2 characters")
    .max(50, "Max 50 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .min(2, "At least 2 characters")
    .max(50, "Max 50 characters")
    .required("Last name is required"),
  phone_number: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .min(10, "At least 10 digits")
    .required("Phone number is required"),
  date_of_birth: Yup.string()
    .required("Date of birth is required")
    .test("not-future", "Date of birth cannot be in the future", (val) => {
      if (!val) return false;
      return new Date(val) <= new Date();
    }),
  gender: Yup.string().required("Gender is required"),
  blood_type: Yup.string()
    .oneOf(
      ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      "Invalid blood type",
    )
    .required("Blood type is required"),
  address: Yup.string()
    .min(5, "At least 5 characters")
    .required("Address is required"),
  city: Yup.string()
    .min(2, "At least 2 characters")
    .required("City is required"),
  state: Yup.string()
    .min(2, "At least 2 characters")
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
  emergency_contact: Yup.object({
    name: Yup.string()
      .min(2, "At least 2 characters")
      .required("Contact name is required"),
    relationship: Yup.string()
      .oneOf(["spouse", "parent", "child", "sibling", "friend", "other"])
      .required("Relationship is required"),
    phone_number: Yup.string()
      .matches(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
      .min(10, "At least 10 digits")
      .required("Contact phone is required"),
  }),
});

const PROFILE_QUERY_KEY = ["user", "profile"];

const s = (val: string | null | undefined): string => val ?? "";

const fetchProfile = async (): Promise<ProfileFormData> => {
  const response = await api.get<ApiProfileData>("user/profile");
  const d = response.data;
  return {
    first_name: s(d.first_name),
    last_name: s(d.last_name),
    phone_number: s(d.phone_number),
    date_of_birth: s(d.date_of_birth),
    gender: s(d.gender),
    blood_type: s(d.blood_type),
    profile_picture: s(d.profile_picture),
    address: s(d.address),
    city: s(d.city),
    state: s(d.state),
    zipcode: s(d.zipcode),
    medical_information: {
      known_allergies: s(d.medical_information?.known_allergies),
      current_medications: s(d.medical_information?.current_medications),
      medical_history: s(d.medical_information?.medical_history),
      primary_physician: s(d.medical_information?.primary_physician),
    },
    preferences: {
      preferred_language: d.preferences?.preferred_language ?? "en",
      communication_preference:
        d.preferences?.communication_preference ?? "email",
      appointment_reminders: d.preferences?.appointment_reminders ?? true,
    },
    emergency_contact: {
      name: s(d.emergency_contact?.name),
      relationship: d.emergency_contact?.relationship ?? "spouse",
      phone_number: s(d.emergency_contact?.phone_number),
    },
  };
};

const updateProfile = async (formData: FormData): Promise<ApiProfileData> => {
  const response = await api.patch<ApiProfileData>("user/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+234")) return cleaned;
  if (cleaned.startsWith("234")) return "+" + cleaned;
  if (cleaned.startsWith("0")) return "+234" + cleaned.substring(1);
  return "+234" + cleaned;
};

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
const relationshipOptions = [
  { value: "spouse", label: "Spouse" },
  { value: "parent", label: "Parent" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Other" },
];
const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];
const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "other", label: "Other" },
];
const communicationOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "sms", label: "SMS" },
  { value: "mail", label: "Mail" },
];

const EditUserProfile: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [completedTabs, setCompletedTabs] = useState<Set<TabId>>(new Set());
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      navigate("/patient/profile");
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const formik = useFormik<ProfileFormData>({
    initialValues: profileData || {
      first_name: "",
      last_name: "",
      phone_number: "",
      date_of_birth: "",
      gender: "",
      blood_type: "",
      profile_picture: "",
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
      emergency_contact: { name: "", relationship: "spouse", phone_number: "" },
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      if (profileImage) {
        formData.append("profile_picture", profileImage);
      }

      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("phone_number", formatPhoneNumber(values.phone_number));
      formData.append("date_of_birth", values.date_of_birth);
      formData.append("gender", values.gender);
      formData.append("blood_type", values.blood_type);
      formData.append("address", values.address);
      formData.append("city", values.city);
      formData.append("state", values.state);
      formData.append("zipcode", values.zipcode);
      formData.append(
        "medical_information",
        JSON.stringify(values.medical_information),
      );
      formData.append("preferences", JSON.stringify(values.preferences));
      formData.append(
        "emergency_contact",
        JSON.stringify({
          ...values.emergency_contact,
          phone_number: formatPhoneNumber(
            values.emergency_contact.phone_number,
          ),
        }),
      );

      updateProfileMutation.mutate(formData);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  useEffect(() => {
    if (!formik.values) return;
    const newCompleted = new Set<TabId>();
    TAB_ORDER.forEach((tab) => {
      if (
        isTabComplete(formik.values, tab) &&
        !hasTabErrors(formik.errors, tab)
      ) {
        newCompleted.add(tab);
      }
    });
    setCompletedTabs(newCompleted);
  }, [formik.values, formik.errors]);

  const handleNextTab = async () => {
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    if (currentIndex === TAB_ORDER.length - 1) return;

    formik.setTouched(
      { ...formik.touched, ...touchTabFields(activeTab) },
      false,
    );
    const errors = await formik.validateForm();

    if (hasTabErrors(errors, activeTab)) {
      toast.error("Please complete all required fields before continuing");
      return;
    }

    setActiveTab(TAB_ORDER[currentIndex + 1]);
  };

  const handleTabClick = async (tabId: TabId) => {
    if (tabId === activeTab) return;
    const targetIndex = TAB_ORDER.indexOf(tabId);
    const currentIndex = TAB_ORDER.indexOf(activeTab);

    if (targetIndex > currentIndex) {
      formik.setTouched(
        { ...formik.touched, ...touchTabFields(activeTab) },
        false,
      );
      const errors = await formik.validateForm();
      if (hasTabErrors(errors, activeTab)) {
        toast.error("Please complete all required fields before continuing");
        return;
      }
    }

    setActiveTab(tabId);
  };

  const compressImage = (file: File): Promise<File> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas failed"));
            return;
          }
          const MAX = 800;
          let { width, height } = img;
          if (width > height) {
            if (width > MAX) {
              height = Math.round((height * MAX) / width);
              width = MAX;
            }
          } else {
            if (height > MAX) {
              width = Math.round((width * MAX) / height);
              height = MAX;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Blob failed"));
                return;
              }
              resolve(
                new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                }),
              );
            },
            "image/jpeg",
            0.85,
          );
        };
        img.onerror = () => reject(new Error("Image load failed"));
      };
      reader.onerror = () => reject(new Error("File read failed"));
    });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should not exceed 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    compressImage(file)
      .then((compressed) => {
        setProfileImage(compressed);
        const reader = new FileReader();
        reader.onloadend = () =>
          setProfileImagePreview(reader.result as string);
        reader.readAsDataURL(compressed);
      })
      .catch(() => toast.error("Failed to process image"));
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const ic = (touched: boolean | undefined, error: string | undefined) =>
    `w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      touched && error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
    }`;

  const FieldError = ({ msg }: { msg: string | undefined }) =>
    msg ? (
      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 shrink-0" />
        {msg}
      </p>
    ) : null;

  if (isFetchingProfile) {
    return (
      <div className="mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
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
            onClick={() => navigate("/patient/profile")}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "personal" as TabId, name: "Personal Info", icon: User },
    { id: "medical" as TabId, name: "Medical Info", icon: Heart },
    { id: "preferences" as TabId, name: "Preferences", icon: Settings },
  ];

  const currentTabIndex = TAB_ORDER.indexOf(activeTab);
  const isLastTab = currentTabIndex === TAB_ORDER.length - 1;
  const currentProfilePicture =
    profileImagePreview || profileData?.profile_picture;

  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-blue-600 mr-3 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-sm text-gray-500">
                Complete each section to update your profile
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/patient/profile")}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        <div className="border-t border-gray-200">
          <nav className="flex px-4 sm:px-6 overflow-x-auto">
            {tabs.map((tab, index) => {
              const isCompleted = completedTabs.has(tab.id);
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 py-4 px-3 sm:px-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : isCompleted
                        ? "border-emerald-400 text-emerald-600 hover:text-emerald-700"
                        : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : isCompleted
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <form id="profile-form" onSubmit={formik.handleSubmit}>
            {activeTab === "personal" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="relative shrink-0">
                      {currentProfilePicture ? (
                        <div className="relative">
                          <img
                            src={currentProfilePicture}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                          <User className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="profile-picture-input"
                      />
                      <label
                        htmlFor="profile-picture-input"
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </label>
                      <p className="mt-2 text-xs text-gray-400">
                        JPG, PNG or GIF. Max 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
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
                      className={ic(
                        formik.touched.first_name,
                        formik.errors.first_name,
                      )}
                    />
                    <FieldError
                      msg={
                        formik.touched.first_name
                          ? formik.errors.first_name
                          : undefined
                      }
                    />
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
                      className={ic(
                        formik.touched.last_name,
                        formik.errors.last_name,
                      )}
                    />
                    <FieldError
                      msg={
                        formik.touched.last_name
                          ? formik.errors.last_name
                          : undefined
                      }
                    />
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
                      className={ic(
                        formik.touched.phone_number,
                        formik.errors.phone_number,
                      )}
                    />
                    <FieldError
                      msg={
                        formik.touched.phone_number
                          ? formik.errors.phone_number
                          : undefined
                      }
                    />
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
                      className={ic(
                        formik.touched.date_of_birth,
                        formik.errors.date_of_birth,
                      )}
                    />
                    <FieldError
                      msg={
                        formik.touched.date_of_birth
                          ? formik.errors.date_of_birth
                          : undefined
                      }
                    />
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
                      className={ic(
                        formik.touched.gender,
                        formik.errors.gender,
                      )}
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <FieldError
                      msg={
                        formik.touched.gender ? formik.errors.gender : undefined
                      }
                    />
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
                      className={ic(
                        formik.touched.blood_type,
                        formik.errors.blood_type,
                      )}
                    >
                      <option value="">Select Blood Type</option>
                      {bloodGroupOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <FieldError
                      msg={
                        formik.touched.blood_type
                          ? formik.errors.blood_type
                          : undefined
                      }
                    />
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  Address Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                  <div className="sm:col-span-2">
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
                      className={ic(
                        formik.touched.address,
                        formik.errors.address,
                      )}
                    />
                    <FieldError
                      msg={
                        formik.touched.address
                          ? formik.errors.address
                          : undefined
                      }
                    />
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
                      className={ic(formik.touched.city, formik.errors.city)}
                    />
                    <FieldError
                      msg={formik.touched.city ? formik.errors.city : undefined}
                    />
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
                      className={ic(formik.touched.state, formik.errors.state)}
                    />
                    <FieldError
                      msg={
                        formik.touched.state ? formik.errors.state : undefined
                      }
                    />
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
                      className={ic(
                        formik.touched.zipcode,
                        formik.errors.zipcode,
                      )}
                    />
                    <FieldError
                      msg={
                        formik.touched.zipcode
                          ? formik.errors.zipcode
                          : undefined
                      }
                    />
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                  Emergency Contact
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="emergency_contact.name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      id="emergency_contact.name"
                      name="emergency_contact.name"
                      value={formik.values.emergency_contact?.name || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={ic(
                        formik.touched.emergency_contact?.name,
                        formik.errors.emergency_contact?.name,
                      )}
                    />
                    <FieldError
                      msg={
                        formik.touched.emergency_contact?.name
                          ? formik.errors.emergency_contact?.name
                          : undefined
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="emergency_contact.phone_number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      id="emergency_contact.phone_number"
                      name="emergency_contact.phone_number"
                      value={
                        formik.values.emergency_contact?.phone_number || ""
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="+2341234567890"
                      className={ic(
                        formik.touched.emergency_contact?.phone_number,
                        formik.errors.emergency_contact?.phone_number,
                      )}
                    />
                    <FieldError
                      msg={
                        formik.touched.emergency_contact?.phone_number
                          ? formik.errors.emergency_contact?.phone_number
                          : undefined
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="emergency_contact.relationship"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Relationship *
                    </label>
                    <select
                      id="emergency_contact.relationship"
                      name="emergency_contact.relationship"
                      value={
                        formik.values.emergency_contact?.relationship || ""
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={ic(
                        formik.touched.emergency_contact?.relationship,
                        formik.errors.emergency_contact?.relationship,
                      )}
                    >
                      <option value="">Select Relationship</option>
                      {relationshipOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <FieldError
                      msg={
                        formik.touched.emergency_contact?.relationship
                          ? formik.errors.emergency_contact?.relationship
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "medical" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Medical Information
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  All fields are optional — fill in what applies to you.
                </p>
                <div className="space-y-6">
                  {[
                    {
                      id: "medical_information.known_allergies",
                      label: "Known Allergies",
                      rows: 3,
                      placeholder:
                        "List any known allergies (e.g., medications, foods, environmental)",
                    },
                    {
                      id: "medical_information.current_medications",
                      label: "Current Medications",
                      rows: 3,
                      placeholder:
                        "List all current medications including dosage and frequency",
                    },
                    {
                      id: "medical_information.medical_history",
                      label: "Medical History",
                      rows: 4,
                      placeholder:
                        "Describe any significant medical history, previous surgeries, chronic conditions, etc.",
                    },
                  ].map(({ id, label, rows, placeholder }) => {
                    const [parent, child] = id.split(".");
                    return (
                      <div key={id}>
                        <label
                          htmlFor={id}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {label}
                        </label>
                        <textarea
                          id={id}
                          name={id}
                          rows={rows}
                          value={(formik.values as any)[parent][child]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder={placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                      </div>
                    );
                  })}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-500" />
                  Preferences & Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      className={ic(
                        formik.touched.preferences?.preferred_language,
                        formik.errors.preferences?.preferred_language,
                      )}
                    >
                      <option value="">Select Language</option>
                      {languageOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <FieldError
                      msg={
                        formik.touched.preferences?.preferred_language
                          ? formik.errors.preferences?.preferred_language
                          : undefined
                      }
                    />
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
                      className={ic(
                        formik.touched.preferences?.communication_preference,
                        formik.errors.preferences?.communication_preference,
                      )}
                    >
                      <option value="">Select Method</option>
                      {communicationOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <FieldError
                      msg={
                        formik.touched.preferences?.communication_preference
                          ? formik.errors.preferences?.communication_preference
                          : undefined
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        id="preferences.appointment_reminders"
                        name="preferences.appointment_reminders"
                        checked={
                          formik.values.preferences.appointment_reminders
                        }
                        onChange={formik.handleChange}
                        className="h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <label
                          htmlFor="preferences.appointment_reminders"
                          className="block text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          Enable appointment reminders
                        </label>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Receive reminders about upcoming appointments via your
                          preferred communication method.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {updateProfileMutation.isError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Error updating profile
                  </p>
                  <p className="text-sm text-red-600 mt-0.5">
                    {updateProfileMutation.error?.message ||
                      "An unexpected error occurred."}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  const prevIndex = currentTabIndex - 1;
                  if (prevIndex >= 0) setActiveTab(TAB_ORDER[prevIndex]);
                }}
                disabled={currentTabIndex === 0}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {isLastTab ? (
                <button
                  type="button"
                  disabled={
                    updateProfileMutation.isPending || formik.isSubmitting
                  }
                  onClick={async () => {
                    const errors = await formik.validateForm();
                    await formik.setTouched(
                      Object.keys(formik.values).reduce((acc: any, key) => {
                        const val = (formik.values as any)[key];
                        if (
                          val &&
                          typeof val === "object" &&
                          !Array.isArray(val)
                        ) {
                          acc[key] = Object.keys(val).reduce(
                            (inner: any, k) => {
                              inner[k] = true;
                              return inner;
                            },
                            {},
                          );
                        } else {
                          acc[key] = true;
                        }
                        return acc;
                      }, {}),
                      true,
                    );

                    if (Object.keys(errors).length > 0) {
                      const failingTab =
                        TAB_ORDER.find((tab) => hasTabErrors(errors, tab)) ??
                        "personal";
                      setActiveTab(failingTab);
                      toast.error("Please fix the errors before saving");
                      return;
                    }

                    formik.handleSubmit();
                  }}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {updateProfileMutation.isPending || formik.isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserProfile;
