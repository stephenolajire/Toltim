import React, { useState } from "react";
import {
  CheckCircle,
  MapPin,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Practitioner, Review } from "./types";

interface PractitionerCardProps {
  practitioner: Practitioner;
  onSelect: (practitioner: Practitioner) => void;
}

const PractitionerCard: React.FC<PractitionerCardProps> = ({
  practitioner,
  onSelect,
}) => {
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  // Sample reviews - replace with actual reviews from practitioner.reviews
  const reviews: Review[] = practitioner.latest_reviews 

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
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
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {practitioner.full_name || practitioner.name}
              </h3>
              <p className="text-blue-600 font-medium text-sm">
                {practitioner.specialization}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">
                  {practitioner.rating || "4.8"}
                </span>
                <span className="text-sm text-gray-500">
                  ({reviews.length} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Reviews Accordion Toggle Button */}
          <button
            onClick={() => setIsReviewsOpen(!isReviewsOpen)}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle reviews"
          >
            {isReviewsOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
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

        {/* Reviews Accordion Content */}
        {isReviewsOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Patient Reviews
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {review.reviewer_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-gray-500">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No reviews yet
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onSelect(practitioner)}
          className="w-full mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Select Provider
        </button>
      </div>
    </div>
  );
};

export default PractitionerCard;
