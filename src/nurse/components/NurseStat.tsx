import { Calendar } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useNurseProfile } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";

const NurseStat: React.FC = () => {
  const userRole = localStorage.getItem("userType");

  const {
    data: nurseProfileData,
    isLoading,
    error,
  } = useNurseProfile(userRole as string);

  // Handle different data structures
  const nurseProfile = React.useMemo(() => {
    if (!nurseProfileData) return null;

    // Check if it's the CHW format (has results array)
    if (nurseProfileData.results && Array.isArray(nurseProfileData.results)) {
      return nurseProfileData.results[0] || null;
    }

    // Otherwise, it's the nurse format (direct object)
    return nurseProfileData;
  }, [nurseProfileData]);

  console.log(nurseProfile);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  if (!nurseProfile) {
    return (
      <div className="w-full bg-white p-6">
        <p className="text-gray-500 text-center">No profile data available</p>
      </div>
    );
  }

  // Helper function to get profile picture
  const getProfilePicture = () => {
    return (
      nurseProfile?.profile_picture ||
      nurseProfile?.profilePicture ||
      "/logo.jpeg"
    );
  };

  // Helper function to get full name
  const getFullName = () => {
    return nurseProfile?.full_name || "Healthcare Professional";
  };

  // Helper function to get specialization
  const getSpecialization = () => {
    return nurseProfile?.specialization || "General Care";
  };

  // Helper function to check if nurse (has verification field)
  const isNurse = () => {
    return (
      "verified_nurse" in nurseProfile || "profile_picture" in nurseProfile
    );
  };

  return (
    <div className="w-full bg-white">
      <div className="w-full">
        {/* Nurse Profile Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 my-4 lg:my-6 flex flex-col lg:flex-row lg:items-center justify-between p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="flex-shrink-0">
              <img
                src={getProfilePicture()}
                alt="Profile"
                className="h-16 w-16 lg:h-20 lg:w-20 rounded-full border-4 border-white/20 object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl lg:text-2xl font-bold text-white truncate">
                {getFullName()}
                {isNurse() ? ", RN" : ""}
              </h2>
              <p className="text-green-100 text-sm lg:text-base mt-1">
                {isNurse() && <>License: RN-12345 • </>}
                Specialty: {getSpecialization()}
              </p>
              <div className="flex items-center mt-2 text-green-100 text-sm">
                {nurseProfile?.years_of_experience !== undefined &&
                  nurseProfile?.years_of_experience > 0 && (
                    <>
                      <span>
                        {nurseProfile.years_of_experience} years experience
                      </span>
                      <span className="mx-2">•</span>
                    </>
                  )}
                <span className="flex items-center">⭐ 4.9 Rating</span>
                <span className="mx-2">•</span>
                <span>156 Sessions Completed</span>
              </div>
              {nurseProfile?.languages &&
                Array.isArray(nurseProfile.languages) && (
                  <div className="flex items-center mt-1 text-green-100 text-sm">
                    Languages: {nurseProfile.languages.join(", ")}
                  </div>
                )}
            </div>
          </div>

          <div className="text-center lg:text-right">
            <div className="text-2xl lg:text-3xl font-bold text-white">
              ₦125,000
            </div>
            <div className="text-green-100 text-sm lg:text-base">
              Wallet Balance
            </div>
          </div>
        </div>

        {/* Services Section for Nurses */}
        {nurseProfile?.services &&
          Array.isArray(nurseProfile.services) &&
          nurseProfile.services.length > 0 && (
            <div className="mb-6 bg-gradient-to-r from-teal-500 to-cyan-600 p-6 rounded-xl shadow-lg">
              <h3 className="text-white text-lg font-semibold mb-3">
                Services Offered
              </h3>
              <div className="flex flex-wrap gap-2">
                {nurseProfile.services.map((service: string, index: number) => (
                  <span
                    key={index}
                    className="bg-white/20 text-white px-3 py-1 rounded-full text-sm capitalize"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Availability Section for Nurses */}
        {nurseProfile?.availability &&
          Array.isArray(nurseProfile.availability) &&
          nurseProfile.availability.length > 0 && (
            <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg">
              <h3 className="text-white text-lg font-semibold mb-3">
                Available Time Slots
              </h3>
              <div className="flex flex-wrap gap-2">
                {nurseProfile.availability.map(
                  (slot: string, index: number) => (
                    <span
                      key={index}
                      className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {slot}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

        {/* Biography Section */}
        {nurseProfile?.biography && (
          <div className="mb-6 bg-gray-50 p-6 rounded-xl shadow">
            <h3 className="text-gray-800 text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-600">{nurseProfile.biography}</p>
          </div>
        )}

        {/* Total Appointments Card */}
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-100 text-base lg:text-lg font-medium">
                Total Appointments
              </h3>
              <div className="text-3xl lg:text-5xl font-bold text-white my-2">
                5
              </div>
              <Link
                to={`/${userRole}/appointment`}
                className="inline-flex items-center text-sm text-blue-100 hover:text-white transition-colors duration-200 underline underline-offset-2"
              >
                Click to view details
              </Link>
            </div>
            <div className="flex-shrink-0">
              <div className="p-3 bg-white/10 rounded-full">
                <Calendar className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseStat;
