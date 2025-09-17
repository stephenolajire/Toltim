import React from "react";
import {
  X,
  Clock,
  CreditCard,
  CheckCircle,
  Info,
  Calendar,
  User,
  Activity,
  Syringe,
  HelpCircle,
  Tag,
} from "lucide-react";

// API Response Types (matching your API structure)
interface APIInclusionItem {
  id: number;
  item: string;
}

interface APIRequirementItem {
  id: number;
  item: string;
}

interface APIProcedure {
  id: number;
  procedure_id: string;
  title: string;
  description: string;
  duration: string;
  repeated_visits: boolean;
  price: string;
  icon_url: string | null;
  status: "active" | "inactive";
  inclusions: APIInclusionItem[];
  requirements: APIRequirementItem[];
  created_at: string;
  updated_at: string;
}

interface ProcedureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedure: APIProcedure | null;
  onSelect?: (procedure: APIProcedure) => void;
}

const ProcedureDetailModal: React.FC<ProcedureDetailModalProps> = ({
  isOpen,
  onClose,
  procedure,
  onSelect,
}) => {
  if (!isOpen || !procedure) return null;

  // Get appropriate icon based on procedure title
  const getServiceIcon = (title: string): React.ReactNode => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("wound") || lowerTitle.includes("dressing")) {
      return <HelpCircle className="w-6 h-6" />;
    }
    if (lowerTitle.includes("injection") || lowerTitle.includes("shot")) {
      return <Syringe className="w-6 h-6" />;
    }
    if (
      lowerTitle.includes("vital") ||
      lowerTitle.includes("monitoring") ||
      lowerTitle.includes("pressure")
    ) {
      return <Activity className="w-6 h-6" />;
    }
    return <HelpCircle className="w-6 h-6" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (priceString: string) => {
    return parseFloat(priceString).toLocaleString();
  };

  const handleSelectProcedure = () => {
    if (onSelect) {
      onSelect(procedure);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              {getServiceIcon(procedure.title)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {procedure.title}
              </h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600 flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  {procedure.procedure_id}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    procedure.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {procedure.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-xl font-bold text-green-600">
                      ₦{formatPrice(procedure.price)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {procedure.duration}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Repeat Visits</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {procedure.repeated_visits ? "Required" : "Not Required"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {procedure.description}
              </p>
            </div>

            {/* Inclusions and Requirements */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* What's Included */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  What's Included ({procedure.inclusions.length})
                </h3>
                <ul className="space-y-3">
                  {procedure.inclusions.map((inclusion) => (
                    <li
                      key={inclusion.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{inclusion.item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Requirements ({procedure.requirements.length})
                </h3>
                {procedure.requirements.length > 0 ? (
                  <ul className="space-y-3">
                    {procedure.requirements.map((requirement) => (
                      <li
                        key={requirement.id}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">
                          {requirement.item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No specific requirements
                  </p>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(procedure.created_at)}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {formatDate(procedure.updated_at)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>

          {onSelect && procedure.status === "active" && (
            <button
              onClick={handleSelectProcedure}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Select This Procedure</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcedureDetailModal;
