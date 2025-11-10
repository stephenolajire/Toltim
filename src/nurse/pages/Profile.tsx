import { useState, useMemo } from "react";
import {
  CheckCircle,
  Edit2,
  Languages,
  Briefcase,
  Clock,
  Award,
} from "lucide-react";
import { useNurseProfile } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import EditProfile from "./components/EditNurseProfile";
import LocationDisplay from "../../components/LocationDisplay";
import { coordinatesToPostGIS } from "../../utils/coordinateToPostGis";

// Mock availability data only
const mockAvailability = [
  "Monday: 9:00 AM - 5:00 PM",
  "Tuesday: 9:00 AM - 5:00 PM",
  "Wednesday: 9:00 AM - 5:00 PM",
  "Thursday: 9:00 AM - 5:00 PM",
  "Friday: 9:00 AM - 5:00 PM",
  "Saturday: 10:00 AM - 2:00 PM",
  "Sunday: Closed",
];

export default function NurseProfile() {
  const [isEditing, setIsEditing] = useState(false);

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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  if (!profileData) {
    return (
      <div className="h-auto bg-green-200 py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No profile data available</p>
        </div>
      </div>
    );
  }

  const formatSpecialization = (spec: string) => {
    return spec
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
    profileData?.longitude
  );

  // Check if it's a nurse (has nurse-specific fields)
  const isNurse =
    "verified_nurse" in profileData || "profile_picture" in profileData;

  // Check if it's a CHW (has CHW-specific fields)
  const isCHW = "years_of_experience" in profileData && !isNurse;

  // Use mock availability instead of API data
  const availability = mockAvailability;

  return (
    <div className="h-auto bg-green-700 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-green-700 to-green-700"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-4">
              <div className="flex-shrink-0">
                {getProfilePicture() ? (
                  <img
                    src={getProfilePicture()}
                    alt={profileData?.full_name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-green-500 flex items-center justify-center">
                    <span className="lg:text-4xl text-2xl font-bold text-white">
                      {getInitials(profileData?.full_name || "")}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="lg:text-3xl text-2xl font-bold text-gray-900">
                        {profileData?.full_name}
                      </h1>
                      {profileData?.verified_nurse && (
                        <CheckCircle className="w-6 h-6 text-green-700" />
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mt-1">
                      {profileData?.specialization
                        ? formatSpecialization(profileData.specialization)
                        : isCHW
                        ? "Community Health Worker"
                        : "Healthcare Professional"}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 sm:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Location */}
            {(profileData?.latitude || profileData?.location) && (
              <div className="flex items-center gap-2 text-gray-600 mt-4">
                <LocationDisplay
                  location={location}
                  className="text-base flex items-center gap-2"
                />
              </div>
            )}

            {/* Years of Experience (for CHW) */}
            {isCHW && profileData?.years_of_experience !== undefined && (
              <div className="flex items-center gap-2 text-gray-600 mt-2">
                <Award className="w-5 h-5 text-green-500" />
                <span>
                  {profileData.years_of_experience}{" "}
                  {profileData.years_of_experience === 1 ? "year" : "years"} of
                  experience
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Biography Section */}
        {profileData?.biography && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed break-words">
              {profileData.biography}
            </p>
          </div>
        )}

        {/* Additional Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Languages */}
          {(profileData?.languages?.length > 0 || isNurse) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Languages
                </h3>
              </div>
              {profileData?.languages?.length > 0 ? (
                <ul className="space-y-2">
                  {profileData.languages.map((lang: any, idx: any) => (
                    <li key={idx} className="text-gray-700">
                      {lang}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No languages specified</p>
              )}
            </div>
          )}

          {/* Services */}
          {(profileData?.services?.length > 0 || isNurse) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Services
                </h3>
              </div>
              {profileData?.services?.length > 0 ? (
                <ul className="space-y-2">
                  {profileData.services.map((service: any, idx: any) => (
                    <li key={idx} className="text-gray-700 capitalize">
                      {service}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No services listed</p>
              )}
            </div>
          )}

          {/* Availability - Using Mock Data */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Availability
              </h3>
            </div>
            <ul className="space-y-2">
              {availability.map((slot: string, idx: number) => (
                <li key={idx} className="text-gray-700">
                  {slot}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Availability Status (for CHW) */}
        {isCHW && profileData?.available !== undefined && (
          <div
            className={`mt-6 ${
              profileData.available
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            } border rounded-lg p-4`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`w-5 h-5 ${
                  profileData.available ? "text-green-600" : "text-gray-600"
                }`}
              />
              <span
                className={`${
                  profileData.available ? "text-green-800" : "text-gray-800"
                } font-medium`}
              >
                {profileData.available
                  ? "Currently Available"
                  : "Currently Unavailable"}
              </span>
            </div>
            <p
              className={`${
                profileData.available ? "text-green-700" : "text-gray-700"
              } text-sm mt-1`}
            >
              {profileData.available
                ? "This healthcare worker is available to accept new appointments."
                : "This healthcare worker is not currently accepting new appointments."}
            </p>
          </div>
        )}

        {/* Verification Badge */}
        {profileData?.verified_nurse && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Verified Nurse</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              This healthcare professional has been verified and meets all
              requirements.
            </p>
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
