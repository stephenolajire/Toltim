import React from "react";
import { Printer, Download, Heart, QrCode } from "lucide-react";

interface ProfessionalData {
  name: string;
  title: string;
  license: string;
  specialty: string;
  experience: string;
  verified: string;
  cardId: string;
  validThrough: string;
  profileImage: string;
}

const IDCard: React.FC = () => {
  const professionalData: ProfessionalData = {
    name: "Nurse Rachel Williams, RN",
    title: "Verified Healthcare Professional",
    license: "RN-12345",
    specialty: "General Nursing, Wound Care",
    experience: "5+ years",
    verified: "June 2024",
    cardId: "TLT-RN-12345",
    validThrough: "2024",
    profileImage: "/api/placeholder/80/80",
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a canvas element to generate the ID card as an image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (ctx) {
      canvas.width = 400;
      canvas.height = 250;

      // Draw background
      ctx.fillStyle = "#10b981";
      ctx.fillRect(0, 0, 400, 250);

      // Add text content
      ctx.fillStyle = "white";
      ctx.font = "bold 16px Arial";
      ctx.fillText("Toltimed", 20, 30);

      ctx.font = "12px Arial";
      ctx.fillText("Verified Healthcare Professional", 20, 50);

      ctx.font = "bold 18px Arial";
      ctx.fillText(professionalData.name, 20, 90);

      ctx.font = "12px Arial";
      ctx.fillText(`License: ${professionalData.license}`, 20, 110);
      ctx.fillText(`Specialty: ${professionalData.specialty}`, 20, 130);
      ctx.fillText(`Experience: ${professionalData.experience}`, 20, 150);
      ctx.fillText(`Verified: ${professionalData.verified}`, 20, 170);

      ctx.fillText(`ID: ${professionalData.cardId}`, 20, 220);
      ctx.fillText(`Valid through ${professionalData.validThrough}`, 280, 220);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "professional-id-card.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm px-2 sm:px-4 md:px-20 lg:px-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Professional ID Card
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium text-green-600 mb-6">
          Professional ID Card
        </h3>
      </div>

      {/* ID Card */}
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 w-full max-w-md text-white shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-white" />
            <div>
              <h4 className="font-bold text-lg">Toltimed</h4>
              <p className="text-sm text-green-100">
                Verified Healthcare Professional
              </p>
            </div>
          </div>

          {/* Professional Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              <img
                src={professionalData.profileImage}
                alt="Professional"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
              <div className="hidden w-full h-full bg-white/30 md:flex items-center justify-center text-2xl font-bold">
                {professionalData.name.split(" ")[1]?.[0] || "N"}
              </div>
            </div>

            <div className="flex-1">
              <h5 className="font-bold text-lg mb-1">
                {professionalData.name}
              </h5>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>License:</strong> {professionalData.license}
                </p>
                <p>
                  <strong>Specialty:</strong> {professionalData.specialty}
                </p>
                <p>
                  <strong>Experience:</strong> {professionalData.experience}
                </p>
                <p>
                  <strong>Verified:</strong> {professionalData.verified}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex justify-end mb-4">
            <div className="bg-white rounded p-2">
              <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <p className="text-xs text-gray-800 text-center mt-1">QR</p>
              <p className="text-xs text-gray-600 text-center">Verify Online</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/20 pt-3 flex justify-between items-center text-sm">
            <span>ID: {professionalData.cardId}</span>
            <span>Valid through {professionalData.validThrough}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 text-center">
        This digital ID card serves as verification of your professional status
        on the Toltimed platform.
      </p>
    </div>
  );
};

export default IDCard;
