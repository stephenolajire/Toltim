import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, MapPin, Loader2, Camera, Upload } from "lucide-react";
import api from "../../../constant/api";
import { useSpecialization } from "../../../constant/GlobalContext";
import { toast } from "react-toastify";

interface ProfileData {
  id: number | string;
  full_name?: string;
  biography?: string;
  specialization?: number | number[];
  verified_nurse?: boolean;
  profile_picture?: string | null;
  latitude?: number;
  longitude?: number;
  availability?: any[];
  languages?: any[];
  services?: any[];
  years_of_experience?: number;
  available?: boolean;
  location?: string;
  user_id?: string;
  active?: string;
}

interface Specialization {
  id: number;
  name: string;
}

interface EditProfileProps {
  profileData: ProfileData;
  onClose: () => void;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function EditProfile({
  profileData,
  onClose,
}: EditProfileProps) {
  const queryClient = useQueryClient();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    profileData.profile_picture || null
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Fetch specializations from the API
  const { data: specializationsData, isLoading: isLoadingSpecializations } =
    useSpecialization();
  const specializations: Specialization[] = specializationsData?.results || [];

  // Get user role
  const userRole = localStorage.getItem("userType") || "nurse";
  const isCHW = userRole === "chw";
  const isNurse = userRole === "nurse";

  // Convert time string (e.g., "9:00 AM" or "9AM") to 24-hour format (e.g., "09:00")
  const convertTo24Hour = (time: string): string => {
    if (!time || typeof time !== "string") return "09:00";

    const match = time.match(/(\d+):?(\d*)?\s*(AM|PM)/i);
    if (!match) return "09:00";

    let hours = parseInt(match[1]);
    const minutes = match[2] || "00";
    const period = match[3].toUpperCase();

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  // Convert 24-hour format (e.g., "09:00") to 12-hour format (e.g., "9:00 AM")
  const convertTo12Hour = (time: string): string => {
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    return `${hour}:${minutes} ${period}`;
  };

  // Parse existing availability to get the first time slot (assuming uniform schedule)
  const parseAvailability = (
    availability: any[]
  ): { startTime: string; endTime: string } => {
    if (!availability || availability.length === 0) {
      return { startTime: "09:00", endTime: "17:00" };
    }

    const firstSlot = availability[0];
    if (!firstSlot || typeof firstSlot !== "string") {
      return { startTime: "09:00", endTime: "17:00" };
    }

    // Try to parse "Monday 9AM-5PM" or "Monday: 9:00 AM - 5:00 PM" format
    const withDayMatch = firstSlot.match(
      /^(\w+)[:\s]+(\d+(?::\d+)?\s*(?:AM|PM))\s*[-–]\s*(\d+(?::\d+)?\s*(?:AM|PM))$/i
    );

    if (withDayMatch) {
      return {
        startTime: convertTo24Hour(withDayMatch[2]),
        endTime: convertTo24Hour(withDayMatch[3]),
      };
    }

    // Try to parse "10am-11am" format (without day)
    const withoutDayMatch = firstSlot.match(
      /^(\d+(?::\d+)?\s*(?:AM|PM))\s*[-–]\s*(\d+(?::\d+)?\s*(?:AM|PM))$/i
    );

    if (withoutDayMatch) {
      return {
        startTime: convertTo24Hour(withoutDayMatch[1]),
        endTime: convertTo24Hour(withoutDayMatch[2]),
      };
    }

    return { startTime: "09:00", endTime: "17:00" };
  };

  const [weeklySchedule, setWeeklySchedule] = useState(
    parseAvailability(profileData.availability || [])
  );

  // Get initial specialization values as array of IDs
  const getInitialSpecializations = (): number[] => {
    const spec = profileData.specialization;
    if (!spec) return [];
    if (Array.isArray(spec)) {
      // Filter to ensure only numbers, not objects
      return spec
        .map((item) => (typeof item === "number" ? item : (item as any)?.id))
        .filter((id): id is number => typeof id === "number");
    }
    return [typeof spec === "number" ? spec : (spec as any)?.id].filter(
      Boolean
    );
  };

  // Initialize form data based on role
  const [formData, setFormData] = useState(
    isCHW
      ? {
          years_of_experience: profileData.years_of_experience || 0,
          latitude: profileData.latitude || 0,
          longitude: profileData.longitude || 0,
          available: profileData.available ?? true,
        }
      : {
          specialization: getInitialSpecializations(),
          biography: profileData.biography || "",
          services: profileData.services?.join(", ") || "",
          languages: profileData.languages?.join(", ") || "",
          latitude: profileData.latitude || 0,
          longitude: profileData.longitude || 0,
        }
  );

  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData | any) => {
      console.log("Sent data:", formData);
      if (isCHW) {
        const response = await api.patch(
          `/user/chw-profile/${profileData.id}/`,
          data
        );
        return response.data;
      } else {
        const response = await api.put(
          `/user/nurse/profile/${profileData.user_id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useNurseProfile"] });
      onClose();
    },
    onError: (error: any) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    },
  });

  const getUserLocation = () => {
    setLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLoadingLocation(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        setLoadingLocation(false);
        console.error("Error getting location:", error);
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle specialization checkbox changes
  const handleSpecializationChange = (id: number) => {
    setFormData((prev: any) => {
      const currentSpecs = prev.specialization as number[];
      const isSelected = currentSpecs.includes(id);
      console.log(id);

      return {
        ...prev,
        specialization: isSelected
          ? currentSpecs.filter((specId) => specId !== id)
          : [...currentSpecs, id],
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScheduleChange = (
    field: "startTime" | "endTime",
    value: string
  ) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatAvailabilityForSubmission = (): string[] => {
    const startTime12 = convertTo12Hour(weeklySchedule.startTime);
    const endTime12 = convertTo12Hour(weeklySchedule.endTime);

    // Create availability for all days with the same time
    return DAYS_OF_WEEK.map((day) => `${day} ${startTime12}-${endTime12}`);
  };

  const handleSubmit = () => {
    if (isCHW) {
      const chwData = {
        years_of_experience: formData.years_of_experience,
        latitude: formData.latitude,
        longitude: formData.longitude,
        available: formData.available,
      };
      updateProfileMutation.mutate(chwData);
    } else {
      const formDataToSend = new FormData();

      // Send specialization as JSON array
      (formData.specialization || []).forEach((specId) => {
        formDataToSend.append("specialization", specId.toString());
      });
      formDataToSend.append("biography", formData.biography || "");

      const servicesArray = (formData.services || "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const languagesArray = (formData.languages || "")
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      // Format availability from weekly schedule (applies to all days)
      const availabilityArray = formatAvailabilityForSubmission();

      formDataToSend.append("services", JSON.stringify(servicesArray));
      formDataToSend.append("availability", JSON.stringify(availabilityArray));
      formDataToSend.append("languages", JSON.stringify(languagesArray));
      formDataToSend.append("latitude", (formData.latitude || 0).toString());
      formDataToSend.append("longitude", (formData.longitude || 0).toString());

      if (selectedImage) {
        formDataToSend.append("profile_picture", selectedImage);
      }

      updateProfileMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={updateProfileMutation.isPending}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {isNurse && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center flex-col md:flex-row gap-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="profile-picture-input"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </label>
                    <input
                      id="profile-picture-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, GIF (max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Specialization (Select one or more)
                </label>
                {isLoadingSpecializations ? (
                  <div className="flex items-center justify-center py-8 border border-gray-300 rounded-lg">
                    <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                    <span className="ml-2 text-gray-600">
                      Loading specializations...
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                      {specializations.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={(
                              formData.specialization as number[]
                            ).includes(option.id)}
                            onChange={() =>
                              handleSpecializationChange(option.id)
                            }
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">
                            {option.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    {(formData.specialization as number[]).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(formData.specialization as number[]).map((specId) => {
                          const option = specializations.find(
                            (opt) => opt.id === specId
                          );
                          return option ? (
                            <span
                              key={specId}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                              {option.name}
                              <button
                                type="button"
                                onClick={() =>
                                  handleSpecializationChange(specId)
                                }
                                className="hover:text-green-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biography
                </label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services (comma-separated)
                </label>
                <input
                  type="text"
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  placeholder="Home Care, Wound Care, Medication Management"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  placeholder="English, Spanish, French"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Weekly Availability (Monday - Sunday)
                </label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">
                    Set your working hours for the entire week (applies to all
                    days)
                  </p>

                  <div className="flex items-center gap-4 flex-col md:flex-row">
                    <div className="flex-1 w-full">
                      <label className="block text-xs text-gray-600 mb-1">
                        From
                      </label>
                      <input
                        type="time"
                        value={weeklySchedule.startTime}
                        onChange={(e) =>
                          handleScheduleChange("startTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <span className="text-gray-400 mt-5 hidden md:flex">—</span>

                    <div className="flex-1 w-full">
                      <label className="block text-xs text-gray-600 mb-1">
                        To
                      </label>
                      <input
                        type="time"
                        value={weeklySchedule.endTime}
                        onChange={(e) =>
                          handleScheduleChange("endTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-800 font-medium mb-1">
                      Preview Schedule:
                    </p>
                    <p className="text-xs text-green-700">
                      {convertTo12Hour(weeklySchedule.startTime)} -{" "}
                      {convertTo12Hour(weeklySchedule.endTime)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      (Applied to all days: Monday - Sunday)
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {isCHW && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Enter years of experience"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Currently Available for Appointments
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Toggle this to indicate your availability status
                </p>
              </div>
            </>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <button
                type="button"
                onClick={getUserLocation}
                disabled={loadingLocation}
                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {loadingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Getting location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Update Location
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                  placeholder="Latitude"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                  placeholder="Longitude"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            {locationError && (
              <p className="text-red-500 text-sm mt-2">{locationError}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={updateProfileMutation.isPending}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={updateProfileMutation.isPending}
            className="px-6 py-2 justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
