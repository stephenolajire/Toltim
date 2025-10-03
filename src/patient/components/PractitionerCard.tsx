// PractitionerCard.tsx
import React from "react";
import {CheckCircle, MapPin, Award } from "lucide-react";
import type { Practitioner } from "./types";

interface PractitionerCardProps {
  practitioner: Practitioner;
  onSelect: (practitioner: Practitioner) => void;
}

const PractitionerCard: React.FC<PractitionerCardProps> = ({
  practitioner,
  onSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <div className="relative flex-shrink-0">
            <img
              src={
                practitioner.profile_picture ||
                practitioner.profileImage ||
                "https://via.placeholder.com/64"
              }
              alt={practitioner.full_name || practitioner.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {practitioner.verified_nurse && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {practitioner.full_name || practitioner.name}
            </h3>
            <p className="text-green-600 font-medium text-sm">
              {practitioner.specialization}
            </p>

            {/* Rating */}
            {/* <div className="flex items-center space-x-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">
                {practitioner.rating || "4.8"}
              </span>
              <span className="text-sm text-gray-500">
                ({practitioner.reviewCount || practitioner.review_count || "0"})
              </span>
            </div> */}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{practitioner.distance || "Nearby"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="w-4 h-4 flex-shrink-0" />
            <span>{practitioner.experience || "5+ years"}</span>
          </div>
        </div>

        {/* Languages */}
        {practitioner?.languages && practitioner.languages.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {practitioner.languages.slice(0, 3).map((language, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {language}
              </span>
            ))}
            {practitioner.languages.length > 3 && (
              <span className="text-xs text-gray-500">
                +{practitioner.languages.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bio */}
        {/* {practitioner.biography && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {practitioner.biography}
          </p>
        )} */}

        {/* Action Button */}
        <button
          onClick={() => onSelect(practitioner)}
          className="w-full mt-4 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          Select Provider
        </button>
      </div>
    </div>
  );
};

export default PractitionerCard;
