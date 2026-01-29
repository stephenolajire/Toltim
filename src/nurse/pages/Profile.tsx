import { useState, useMemo } from "react";
import {
  CheckCircle,
  Edit2,
  Languages,
  Briefcase,
  Clock,
  Award,
  // MapPin,
  Star,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { useNurseProfile } from "../../constant/GlobalContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../constant/api";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import EditProfile from "./components/EditNurseProfile";
import LocationDisplay from "../../components/LocationDisplay";
import { coordinatesToPostGIS } from "../../utils/coordinateToPostGis";
import { toast } from "react-toastify";

export default function NurseProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const userRole = localStorage.getItem("userType");
  console.log(userRole);

  const {
    data: profileDataRaw,
    isLoading,
    error,
  } = useNurseProfile(userRole as string);

  console.log(profileDataRaw);

  // Normalize the data structure
  const profileData = useMemo(() => {
    if (!profileDataRaw) return null;

    // Check if it's the CHW format (has results array)
    if (profileDataRaw.results && Array.isArray(profileDataRaw.results)) {
      return profileDataRaw.results[0] || null;
    }

    // Otherwise, it's the nurse format (direct object)
    return profileDataRaw;
  }, [profileDataRaw]);

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch("user/nurse/profile/toggle-active/");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nurseProfile"] });
    },
    onError: (error: any) => {
      console.error("Error toggling active status:", error);
      toast.error("Failed to update status. Please try again.");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-gray-500">No profile data available</p>
        </div>
      </div>
    );
  }

  const formatSpecialization = (spec: any) => {
    // Handle array format
    if (Array.isArray(spec)) {
      if (spec.length === 0) return null;

      return spec
        .map((s) => {
          // If it's an object with name property (new format)
          if (typeof s === "object" && s !== null && s.name) {
            return s.name;
          }
          // If it's a string (old format)
          if (typeof s === "string") {
            return s
              .split("-")
              .map(
                (word: string) => word.charAt(0).toUpperCase() + word.slice(1),
              )
              .join(" ");
          }
          return null;
        })
        .filter(Boolean)
        .join(", ");
    }

    // Handle string format
    if (typeof spec === "string") {
      return spec
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // Handle single object format
    if (typeof spec === "object" && spec !== null && spec.name) {
      return spec.name;
    }

    return null;
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Helper to get profile picture
  const getProfilePicture = () => {
    return profileData?.profile_picture || profileData?.profilePicture;
  };

  const location = coordinatesToPostGIS(
    profileData?.latitude,
    profileData?.longitude,
  );

  // Check if it's a nurse (has nurse-specific fields)
  const isNurse =
    "verified_nurse" in profileData || "profile_picture" in profileData;

  // Check if it's a CHW (has CHW-specific fields)
  const isCHW = "years_of_experience" in profileData && !isNurse;

  // Format availability to ensure correct display format
  const formatAvailability = (availability: any[]) => {
    if (!availability || availability.length === 0) return [];

    // If it's already in the correct format "Monday-Sunday 9:00 AM-5:00 PM"
    return availability.map((slot) => {
      if (typeof slot === "string") {
        // Check if it's already in the correct format
        if (slot.includes("Monday-Sunday") || slot.includes("-Sunday")) {
          return slot;
        }
        // Otherwise return as is (for legacy formats)
        return slot;
      }
      return slot;
    });
  };

  // Use formatted availability
  const availability = formatAvailability(
    profileData?.availability && profileData.availability.length > 0
      ? profileData.availability
      : [],
  );

  const isActive = profileData?.active;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-visible mb-6">
          {/* Cover Background */}
          <div className="h-40 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 relative">
            {/* Active Status Toggle - Top Right */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => toggleActiveMutation.mutate()}
                disabled={toggleActiveMutation.isPending}
                className={`
                  relative inline-flex h-8 w-14 items-center rounded-full transition-colors
                  ${
                    isActive
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-300 hover:bg-gray-400"
                  }
                  ${
                    toggleActiveMutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                  shadow-lg
                `}
                title={isActive ? "Active" : "Inactive"}
              >
                <span
                  className={`
                    inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md
                    ${isActive ? "translate-x-7" : "translate-x-1"}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-20 mb-6">
              {/* Profile Picture */}
              <div className="flex-shrink-0 relative">
                {getProfilePicture() ? (
                  <img
                    src={getProfilePicture()}
                    alt={profileData?.full_name}
                    className="w-36 h-36 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {getInitials(profileData?.full_name || "")}
                    </span>
                  </div>
                )}
                {/* Active Indicator Badge */}
                <div
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${
                    isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                  title={isActive ? "Active" : "Inactive"}
                />
              </div>

              {/* Name and Edit Button */}
              <div className="mt-6 sm:mt-0 sm:ml-6 flex-1 w-full">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-3xl font-bold text-gray-900 break-words">
                        {profileData?.full_name}
                      </h1>
                      {profileData?.verified_nurse && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-700" />
                          <span className="text-xs font-medium text-green-700">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mt-1 font-medium break-words">
                      {profileData?.specialization
                        ? formatSpecialization(profileData.specialization)
                        : isCHW
                          ? "Community Health Worker"
                          : "Healthcare Professional"}
                    </p>

                    {/* Location */}
                    {(profileData?.latitude || profileData?.location) && (
                      <div className="flex items-start gap-2 text-gray-500 mt-2">
                        {/* <MapPin className="w-4 h-4 flex-shrink-0 mt-1" /> */}
                        <LocationDisplay
                          location={location}
                          className="text-sm break-words"
                        />
                      </div>
                    )}

                    {/* Years of Experience (for CHW) */}
                    {isCHW &&
                      profileData?.years_of_experience !== undefined && (
                        <div className="flex items-center gap-2 text-gray-600 mt-2">
                          <Award className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm break-words">
                            {profileData.years_of_experience}{" "}
                            {profileData.years_of_experience === 1
                              ? "year"
                              : "years"}{" "}
                            of experience
                          </span>
                        </div>
                      )}
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="relative z-20 flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium whitespace-nowrap flex-shrink-0"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-green-50 border border-green-200"
                  : "bg-gray-100 border border-gray-300"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-green-500" : "bg-gray-400"
                } animate-pulse flex-shrink-0`}
              />
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-green-700" : "text-gray-600"
                }`}
              >
                {isActive ? "Active and Available" : "Currently Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Biography Section */}
        {profileData?.biography && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
              {profileData.biography}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Rating Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-400">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Average Rating
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {profileData?.rating || 0}
                  </p>
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Review Count Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-400">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Reviews
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {profileData?.review_count || 0}
                  </p>
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Completed Cases Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-400">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Completed Cases
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {profileData?.completed_cases || 0}
                  </p>
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Languages */}
          {(profileData?.languages?.length > 0 || isNurse) && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Languages className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Languages
                </h3>
              </div>
              {profileData?.languages?.length > 0 ? (
                <ul className="space-y-2">
                  {profileData.languages.map((lang: any, idx: any) => (
                    <li
                      key={idx}
                      className="text-gray-700 pl-4 border-l-2 border-green-200 break-words"
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  No languages specified
                </p>
              )}
            </div>
          )}

          {/* Services */}
          {(profileData?.services?.length > 0 || isNurse) && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Services
                </h3>
              </div>
              {profileData?.services?.length > 0 ? (
                <ul className="space-y-2">
                  {profileData.services.map((service: any, idx: any) => (
                    <li
                      key={idx}
                      className="text-gray-700 capitalize pl-4 border-l-2 border-green-200 break-words"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  No services listed
                </p>
              )}
            </div>
          )}

          {/* Availability */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Availability
              </h3>
            </div>
            {availability.length > 0 ? (
              <ul className="space-y-2">
                {availability.map((slot: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-gray-700 pl-4 border-l-2 border-green-200 break-words"
                  >
                    {slot}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm italic">
                No availability set
              </p>
            )}
          </div>
        </div>

        {/* Availability Status (for CHW) */}
        {isCHW && profileData?.available !== undefined && (
          <div
            className={`mt-6 rounded-xl p-5 ${
              profileData.available
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <CheckCircle
                className={`w-6 h-6 mt-0.5 flex-shrink-0 ${
                  profileData.available ? "text-green-600" : "text-gray-400"
                }`}
              />
              <div className="min-w-0">
                <h4
                  className={`font-semibold break-words ${
                    profileData.available ? "text-green-900" : "text-gray-800"
                  }`}
                >
                  {profileData.available
                    ? "Currently Available"
                    : "Currently Unavailable"}
                </h4>
                <p
                  className={`text-sm mt-1 break-words ${
                    profileData.available ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  {profileData.available
                    ? "This healthcare worker is available to accept new appointments."
                    : "This healthcare worker is not currently accepting new appointments."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Badge */}
        {profileData?.verified_nurse && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="text-green-900 font-semibold break-words">
                  Verified Healthcare Professional
                </h4>
                <p className="text-green-700 text-sm mt-1 break-words">
                  This healthcare professional has been verified and meets all
                  requirements.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Latest Reviews Section */}
        {profileData?.latest_reviews &&
          profileData.latest_reviews.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Latest Reviews
                </h3>
              </div>

              <div className="space-y-4">
                {profileData.latest_reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 break-words">
                          {review.reviewer_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-4 h-4 ${
                              idx < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 break-words leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <EditProfile
          profileData={profileData}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
