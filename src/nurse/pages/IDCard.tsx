import React from "react";
import { Download, Heart, QrCode } from "lucide-react";
import { useNurseProfile } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import QRCodeCanvas from "qrcode";

interface ProfessionalData {
  name: string;
  title: string;
  license: string;
  specialty: string;
  experience: string;
  verified: string;
  cardId: string;
  validThrough: string;
  profileImage: string | null;
}

const IDCard: React.FC = () => {
  const userRole = localStorage.getItem("userType");
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string>("");
  const qrCanvasRef = React.useRef<HTMLCanvasElement>(null);

  const {
    data: profileDataRaw,
    isLoading,
    error,
  } = useNurseProfile(userRole as string);

  // Normalize the data structure
  const profileData = React.useMemo(() => {
    if (!profileDataRaw) return null;

    // Check if it's the CHW format (has results array)
    if (profileDataRaw.results && Array.isArray(profileDataRaw.results)) {
      return profileDataRaw.results[0] || null;
    }

    // Otherwise, it's the nurse format (direct object)
    return profileDataRaw;
  }, [profileDataRaw]);

  // Format specialization
  const formatSpecialization = (spec: any) => {
    if (Array.isArray(spec)) {
      if (spec.length === 0) return "Healthcare Professional";

      return spec
        .map((s) => {
          if (typeof s === "object" && s !== null && s.name) {
            return s.name;
          }
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

    if (typeof spec === "string") {
      return spec
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    if (typeof spec === "object" && spec !== null && spec.name) {
      return spec.name;
    }

    return "Healthcare Professional";
  };

  // Helper function to capitalize name
  const capitalizeName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Convert profile data to professional data
  const professionalData: ProfessionalData | null = React.useMemo(() => {
    if (!profileData) return null;

    const currentYear = new Date().getFullYear();
    const isNurse = "verified_nurse" in profileData;
    const isCHW = "years_of_experience" in profileData && !isNurse;

    return {
      name: profileData.full_name
        ? capitalizeName(profileData.full_name)
        : "Healthcare Professional",
      title: isNurse
        ? "Verified Nurse"
        : isCHW
          ? "Community Health Worker"
          : "Healthcare Professional",
      license: profileData.user_id
        ? `ID-${profileData.user_id.slice(0, 8).toUpperCase()}`
        : "N/A",
      specialty: profileData.specialization
        ? formatSpecialization(profileData.specialization)
        : isCHW
          ? "Community Health"
          : "General Healthcare",
      experience: isCHW
        ? `${profileData.years_of_experience || 0}+ years`
        : profileData.completed_cases
          ? `${profileData.completed_cases} completed cases`
          : "Professional",
      verified: profileData.verified_nurse ? "Verified" : "Active",
      cardId: `TLT-${profileData.id || "0000"}`,
      validThrough: currentYear.toString(),
      profileImage:
        profileData.profile_picture || profileData.profilePicture || null,
    };
  }, [profileData]);

  // Generate QR Code with profile details
  React.useEffect(() => {
    if (professionalData && qrCanvasRef.current) {
      // Create a JSON object with profile details
      const qrData = {
        platform: "Toltimed Healthcare",
        name: professionalData.name,
        title: professionalData.title,
        license: professionalData.license,
        specialty: professionalData.specialty,
        experience: professionalData.experience,
        verified: professionalData.verified,
        cardId: professionalData.cardId,
        validThrough: professionalData.validThrough,
      };

      // Generate QR code
      QRCodeCanvas.toCanvas(
        qrCanvasRef.current,
        JSON.stringify(qrData),
        {
          width: 100,
          margin: 1,
          color: {
            dark: "#1f2937",
            light: "#ffffff",
          },
        },
        (error) => {
          if (error) {
            console.error("QR Code generation error:", error);
          } else {
            // Convert canvas to data URL for download functionality
            const dataUrl = qrCanvasRef.current?.toDataURL() || "";
            setQrCodeDataUrl(dataUrl);
          }
        },
      );
    }
  }, [professionalData]);

  // const handlePrint = () => {
  //   window.print();
  // };

  const handleDownload = () => {
    if (!professionalData) return;

    // Create a canvas element to generate the ID card as an image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (ctx) {
      canvas.width = 500;
      canvas.height = 300;

      // Function to draw the card content
      const drawCard = (profileImg?: HTMLImageElement) => {
        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, 500, 300);
        gradient.addColorStop(0, "#10b981");
        gradient.addColorStop(1, "#059669");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 500, 300);

        // Add text content
        ctx.fillStyle = "white";
        ctx.font = "bold 20px Arial";
        ctx.fillText("Toltimed", 20, 35);

        ctx.font = "14px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillText(professionalData.title, 20, 55);

        // Draw profile image or initials
        if (profileImg) {
          // Save context state
          ctx.save();

          // Create circular clipping path
          ctx.beginPath();
          ctx.arc(48, 100, 32, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          // Calculate dimensions to maintain aspect ratio and cover the circle
          const size = 64;
          const x = 16;
          const y = 68;

          // Draw white background
          ctx.fillStyle = "white";
          ctx.fillRect(x, y, size, size);

          // Calculate scaling to cover the circle while maintaining aspect ratio
          const scale = Math.max(
            size / profileImg.width,
            size / profileImg.height,
          );
          const scaledWidth = profileImg.width * scale;
          const scaledHeight = profileImg.height * scale;

          // Center the image
          const offsetX = x + (size - scaledWidth) / 2;
          const offsetY = y + (size - scaledHeight) / 2;

          // Draw image
          ctx.drawImage(
            profileImg,
            offsetX,
            offsetY,
            scaledWidth,
            scaledHeight,
          );

          // Restore context state
          ctx.restore();
        } else {
          // Draw initials circle background
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.beginPath();
          ctx.arc(48, 100, 32, 0, Math.PI * 2);
          ctx.fill();

          // Draw initials
          ctx.fillStyle = "white";
          ctx.font = "bold 24px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const initials = professionalData.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
          ctx.fillText(initials, 48, 100);
          ctx.textAlign = "left";
          ctx.textBaseline = "alphabetic";
        }

        // Professional name and details
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(professionalData.name, 90, 90);

        ctx.font = "13px Arial";
        ctx.fillText(`License: ${professionalData.license}`, 90, 110);

        // Truncate specialty if too long
        const specialty =
          professionalData.specialty.length > 30
            ? professionalData.specialty.substring(0, 30) + "..."
            : professionalData.specialty;
        ctx.fillText(`Specialty: ${specialty}`, 90, 130);
        ctx.fillText(`Experience: ${professionalData.experience}`, 90, 150);
        ctx.fillText(`Status: ${professionalData.verified}`, 90, 170);

        // Draw QR Code if available
        if (qrCanvasRef.current) {
          // Draw white background for QR code
          ctx.fillStyle = "white";
          ctx.fillRect(380, 90, 100, 120);

          // Draw QR code
          ctx.drawImage(qrCanvasRef.current, 385, 95, 90, 90);

          // Add QR label
          ctx.fillStyle = "#1f2937";
          ctx.font = "10px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Scan to Verify", 430, 195);
          ctx.fillText("Professional", 430, 207);
          ctx.textAlign = "left";
        }

        // Footer
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(`ID: ${professionalData.cardId}`, 20, 270);
        ctx.fillText(
          `Valid through ${professionalData.validThrough}`,
          350,
          270,
        );

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${professionalData.name.replace(/\s+/g, "-")}-id-card.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      };

      // Load profile image if available
      if (professionalData.profileImage) {
        // Fetch image as blob to avoid CORS issues
        const imageUrl = professionalData.profileImage.startsWith("http")
          ? professionalData.profileImage
          : `${window.location.origin}${professionalData.profileImage}`;

        console.log("Fetching image from:", imageUrl);

        fetch(imageUrl)
          .then((response) => {
            if (!response.ok) {
              throw error;
            }
            return response.blob();
          })
          .then((blob) => {
            // Convert blob to data URL
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                console.log("Image loaded successfully for download");
                drawCard(img);
              };
              img.onerror = (err) => {
                console.error("Image failed to load from data URL:", err);
                drawCard();
              };
              img.src = e.target?.result as string;
            };
            reader.onerror = () => {
              console.error("Failed to read blob as data URL");
              drawCard();
            };
            reader.readAsDataURL(blob);
          })
          .catch((err) => {
            console.error("Failed to fetch image:", err);
            // If fetch fails, draw card without image
            drawCard();
          });
      } else {
        // No profile image, draw card with initials
        drawCard();
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  if (!professionalData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm px-4 sm:px-6 md:px-12 lg:px-20 py-6">
      {/* Header - visible only on screen, hidden on print */}
      <div className="print:hidden mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Professional ID Card
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button> */}
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        <h3 className="text-lg font-medium text-green-600 mb-6">
          Professional ID Card
        </h3>
      </div>

      {/* ID Card */}
      <div className="flex justify-center mb-6 print:mb-0">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 w-full max-w-md text-white shadow-lg print:shadow-none">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-white" />
            <div>
              <h4 className="font-bold text-lg">Toltimed</h4>
              <p className="text-sm text-green-100">{professionalData.title}</p>
            </div>
          </div>

          {/* Professional Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
              {professionalData.profileImage ? (
                <img
                  src={professionalData.profileImage}
                  alt={professionalData.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const sibling = target.nextElementSibling as HTMLElement;
                    if (sibling) {
                      sibling.classList.remove("hidden");
                    }
                  }}
                />
              ) : null}
              <div
                className={`${
                  professionalData.profileImage ? "hidden" : "flex"
                } w-full h-full bg-white/30 items-center justify-center text-2xl font-bold`}
              >
                {professionalData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-lg mb-1 break-words">
                {professionalData.name}
              </h5>
              <div className="space-y-1 text-sm">
                <p className="break-words">
                  <strong>License:</strong> {professionalData.license}
                </p>
                <p className="break-words">
                  <strong>Specialty:</strong> {professionalData.specialty}
                </p>
                <p className="break-words">
                  <strong>Experience:</strong> {professionalData.experience}
                </p>
                <p className="break-words">
                  <strong>Status:</strong> {professionalData.verified}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex justify-end mb-4">
            <div className="bg-white rounded p-2">
              <canvas
                ref={qrCanvasRef}
                className="w-20 h-20 rounded"
                style={{ display: qrCodeDataUrl ? "block" : "none" }}
              />
              {!qrCodeDataUrl && (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <p className="text-xs text-gray-800 text-center mt-1">
                Scan to Verify
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/20 pt-3 flex flex-wrap justify-between items-center text-xs sm:text-sm gap-2">
            <span className="break-words">ID: {professionalData.cardId}</span>
            <span className="break-words">
              Valid through {professionalData.validThrough}
            </span>
          </div>
        </div>
      </div>

      {/* Description - hidden on print */}
      <p className="text-sm text-gray-600 text-center print:hidden">
        This digital ID card serves as verification of your professional status
        on the Toltimed platform.
      </p>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #root, #root * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          @page {
            size: auto;
            margin: 20mm;
          }
        }
      `}</style>
    </div>
  );
};

export default IDCard;
