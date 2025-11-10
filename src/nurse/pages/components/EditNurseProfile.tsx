import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, MapPin, Loader2, Camera, Upload, Plus, Trash2 } from "lucide-react";
import api from "../../../constant/api";

interface ProfileData {
  id: number | string;
  full_name?: string;
  biography?: string;
  specialization?: string;
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
}

interface EditProfileProps {
  profileData: ProfileData;
  onClose: () => void;
}

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
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

  // Get user role
  const userRole = localStorage.getItem("userType") || "nurse";
  const isCHW = userRole === "chw";
  const isNurse = userRole === "nurse";

  // Convert time string (e.g., "9:00 AM") to 24-hour format (e.g., "09:00")
  const convertTo24Hour = (time: string): string => {
    const match = time.match(/(\d+):?(\d*)?\s*(AM|PM)/i);
    if (!match) return "09:00"; // default

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

  // Parse existing availability into time slots
  const parseAvailability = (availability: any[]): TimeSlot[] => {
    if (!availability || availability.length === 0) return [];

    return availability
      .map((slot: any) => {
        if (typeof slot === "string") {
          // Parse "Monday 9AM-5PM" format
          const match = slot.match(
            /^(\w+)\s+(\d+(?::\d+)?(?:AM|PM))-(\d+(?::\d+)?(?:AM|PM))$/i
          );
          if (match) {
            return {
              day: match[1],
              startTime: convertTo24Hour(match[2]),
              endTime: convertTo24Hour(match[3]),
            };
          }
        }
        return slot;
      })
      .filter(Boolean);
  };

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    parseAvailability(profileData.availability || [])
  );

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
          specialization: profileData.specialization || "",
          biography: profileData.biography || "",
          services: profileData.services?.join(", ") || "",
          languages: profileData.languages?.join(", ") || "",
          latitude: profileData.latitude || 0,
          longitude: profileData.longitude || 0,
        }
  );

  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData | any) => {
      if (isCHW) {
        const response = await api.patch(
          `/user/chw-profile/${profileData.id}/`,
          data
        );
        return response.data;
      } else {
        const response = await api.patch("/user/nurse/profile/", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nurseProfile"] });
      onClose();
    },
    onError: (error: any) => {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
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

  const handleInputChange = (e:any) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
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

  const addTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
    ]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const updated = [...timeSlots];
    updated[index][field] = value;
    setTimeSlots(updated);
  };

  const formatAvailabilityForSubmission = (): string[] => {
    return timeSlots.map((slot) => {
      const startTime12 = convertTo12Hour(slot.startTime);
      const endTime12 = convertTo12Hour(slot.endTime);
      return `${slot.day} ${startTime12}-${endTime12}`;
    });
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

      formDataToSend.append("specialization", formData.specialization || "");
      formDataToSend.append("biography", formData.biography || "");

      const servicesArray = (formData.services || "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const languagesArray = (formData.languages || "")
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      // Format availability from time slots
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="critical-care">Critical Care</option>
                  <option value="pediatric">Pediatric</option>
                  <option value="geriatric">Geriatric</option>
                  <option value="emergency">Emergency</option>
                  <option value="oncology">Oncology</option>
                  <option value="mental-health">Mental Health</option>
                  <option value="general">General</option>
                </select>
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
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Availability Schedule
                  </label>
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Day
                  </button>
                </div>

                {timeSlots.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-sm">
                      No availability added yet
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Click "Add Day" to set your schedule
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <select
                            value={slot.day}
                            onChange={(e) =>
                              updateTimeSlot(index, "day", e.target.value)
                            }
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-medium"
                          >
                            {DAYS_OF_WEEK.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => removeTimeSlot(index)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 flex-col md:flex-row">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">
                              From
                            </label>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  index,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            />
                          </div>

                          <span className="text-gray-400 mt-5 hidden md:flex">—</span>

                          <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">
                              To
                            </label>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateTimeSlot(index, "endTime", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                          Times will be converted to 12-hour format (AM/PM) when saved
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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
            className="px-6 py-2 justify-center  bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
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