import React, { useState } from "react";
import {Clock, FileText } from "lucide-react";

interface Procedure {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  multipleVisits?: boolean;
}

const NursingProcedures: React.FC = () => {
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);

  const procedures: Procedure[] = [
    {
      id: "post-surgical",
      name: "Post-Surgical Care",
      description:
        "Comprehensive care after surgical procedures including wound monitoring and medication management",
      price: 15000,
      duration: "45-60 minutes",
      category: "Surgical Care",
      multipleVisits: true,
    },
    {
      id: "wound-management",
      name: "Wound Management",
      description:
        "Professional wound care, dressing changes, and healing assessment",
      price: 8000,
      duration: "30-45 minutes",
      category: "Wound Care",
      multipleVisits: true,
    },
    {
      id: "catheter-care",
      name: "Catheter Care and Removal",
      description:
        "Catheter maintenance, cleaning, and safe removal when needed",
      price: 12000,
      duration: "20-30 minutes",
      category: "Medical Procedures",
    },
    {
      id: "circumcision",
      name: "Male Child Circumcision",
      description:
        "Safe circumcision procedure for male children with post-care instructions",
      price: 25000,
      duration: "30-45 minutes",
      category: "Minor Surgery",
    },
    {
      id: "vital-signs",
      name: "Vital Signs Monitoring",
      description:
        "Blood pressure, pulse rate, temperature, and blood sugar testing",
      price: 5000,
      duration: "15-20 minutes",
      category: "Health Monitoring",
      multipleVisits: true,
    },
    {
      id: "antenatal-checkup",
      name: "Antenatal Check-up",
      description:
        "Fetal heart rate monitoring, blood pressure checks, and pregnancy wellness assessment",
      price: 10000,
      duration: "30-40 minutes",
      category: "Maternal Care",
      multipleVisits: true,
    },
    {
      id: "breast-examination",
      name: "Breast Examination",
      description: "Professional breast examination and health assessment",
      price: 8000,
      duration: "20-30 minutes",
      category: "Women's Health",
    },
    {
      id: "cervical-screening",
      name: "Cervical Screening",
      description: "Cervical health screening and examination",
      price: 12000,
      duration: "25-35 minutes",
      category: "Women's Health",
    },
    {
      id: "family-planning",
      name: "Family Planning Consultation",
      description: "Contraceptive counseling and reproductive health guidance",
      price: 7000,
      duration: "30-45 minutes",
      category: "Reproductive Health",
    },
    {
      id: "nebulization",
      name: "Nebulization Therapy",
      description: "Nebulization treatment for asthma and mild bronchospasm",
      price: 6000,
      duration: "20-30 minutes",
      category: "Respiratory Care",
      multipleVisits: true,
    },
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const groupedProcedures = procedures.reduce((acc, procedure) => {
    if (!acc[procedure.category]) {
      acc[procedure.category] = [];
    }
    acc[procedure.category].push(procedure);
    return acc;
  }, {} as Record<string, Procedure[]>);

  const handleProcedureSelect = (procedureId: string) => {
    setSelectedProcedures((prev) =>
      prev.includes(procedureId)
        ? prev.filter((id) => id !== procedureId)
        : [...prev, procedureId]
    );
  };

  const getSelectedProceduresCount = () => selectedProcedures.length;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <div className="flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-green-500 mr-2" />
            <span className="text-xl font-medium text-gray-700">Toltimed</span>
          </div> */}

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nursing Procedures
          </h1>
          <p className="text-gray-600">
            Book professional nursing care at your home
          </p>
        </div>

        {/* Procedures Grid */}
        <div className="space-y-8">
          {Object.entries(groupedProcedures).map(
            ([category, categoryProcedures]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryProcedures.map((procedure) => (
                    <div
                      key={procedure.id}
                      className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedProcedures.includes(procedure.id)
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleProcedureSelect(procedure.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                          {procedure.name}
                        </h3>
                        <div className="text-right ml-2">
                          <div className="text-lg font-bold text-green-600">
                            {formatPrice(procedure.price)}
                          </div>
                          <div className="text-xs text-gray-500">per visit</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {procedure.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {procedure.duration}
                        </div>
                        {procedure.multipleVisits && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Multiple Visits Available
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {/* Booking Summary */}
        {getSelectedProceduresCount() > 0 && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-64">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Booking Summary
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {getSelectedProceduresCount()} procedure
              {getSelectedProceduresCount() > 1 ? "s" : ""} selected
            </p>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
              Select procedures to see summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NursingProcedures;
