// PractitionerCard.tsx
import React, { useState } from "react";
import {
  Star,
  CheckCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MapPin,
  Award,
  Verified,
  BookOpen,
  ThumbsUp,
  Clock,
} from "lucide-react";
import type { Practitioner } from "./types";

interface PractitionerCardProps {
  practitioner: Practitioner;
  onSelect: (practitioner: Practitioner) => void;
}

const PractitionerCard: React.FC<PractitionerCardProps> = ({
  practitioner,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-shrink-0 self-center sm:self-start">
            <img
              src={practitioner.profileImage}
              alt={practitioner.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {practitioner.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-2 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 flex-wrap">
                  <span className="truncate">{practitioner.full_name}</span>
                  {practitioner.isVerified && (
                    <Verified className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  )}
                </h3>
                <p className="text-green-600 font-medium text-sm sm:text-base">
                  {practitioner.title}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {practitioner.specialization}
                </p>
              </div>

              <div className="text-left sm:text-right flex-shrink-0">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">
                    {practitioner.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({practitioner.reviewCount})
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {practitioner.priceRange}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{practitioner.distance}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {practitioner.experience} experience
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {practitioner.completedCases} cases
                </span>
              </div>
            </div>

            {/* Languages */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {practitioner?.languages?.map((language, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {practitioner?.services?.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {service}
              </span>
            ))}
            {practitioner?.services?.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                +{practitioner.services.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Response Time */}
        <div className="mt-3 text-sm text-green-600 flex items-center space-x-1">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span className="break-words">{practitioner?.responseTime}</span>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {practitioner.bio}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Qualifications
              </h4>
              <div className="space-y-1">
                {practitioner.qualifications.map((qual, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <BookOpen className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 break-words">
                      {qual}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">All Services</h4>
              <div className="flex flex-wrap gap-2">
                {practitioner.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 pt-4 border-t border-gray-200 space-y-3 sm:space-y-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center sm:justify-start space-x-1"
          >
            <span>{isExpanded ? "Show Less" : "Show More"}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <div className="flex items-center justify-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 flex-shrink-0">
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelect(practitioner)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex-shrink-0"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerCard;
