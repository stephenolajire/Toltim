import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import {
  Heart,
  Shield,
  User,
  ArrowLeft,
  Camera,
  Loader2,
  CheckCircle,
  X,
  RotateCcw,
} from "lucide-react";
import api from "../constant/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const KYCVerification = () => {
  const webcamRef = useRef<Webcam>(null);
  const userType =  localStorage.getItem("userType")
  const navigate = useNavigate()

  const [formData, setFormData] = useState<{
    nin: string;
    selfieImage: File | null;
    selfiePreview: string | null;
  }>({
    nin: "",
    selfieImage: null,
    selfiePreview: null,
  });

  const [cameraMode, setCameraMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const file = dataURLtoFile(imageSrc, "selfie.jpg");

        setFormData((prev) => ({
          ...prev,
          selfieImage: file,
          selfiePreview: imageSrc,
        }));

        setCameraMode(false);
        toast.success("Photo captured successfully!");
      } else {
        toast.error("Failed to capture photo. Please try again.");
      }
    }
  }, [webcamRef]);

  const handleNinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setFormData((prev) => ({ ...prev, nin: value }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      selfieImage: null,
      selfiePreview: null,
    }));
  };

  const handleUserMediaError = (error: string | DOMException) => {
    console.error("Camera error:", error);
    setCameraMode(false);

    if (typeof error === "string") {
      toast.error(error);
    } else {
      let errorMessage = "Unable to access camera. ";

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        errorMessage +=
          "Please grant camera permissions in your browser settings.";
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        errorMessage += "No camera found on your device.";
      } else if (
        error.name === "NotReadableError" ||
        error.name === "TrackStartError"
      ) {
        errorMessage += "Camera is already in use by another application.";
      } else {
        errorMessage += "Please check your camera permissions.";
      }

      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nin || formData.nin.length !== 11) {
      toast.error("Please enter a valid 11-digit NIN");
      return;
    }

    if (!formData.selfieImage) {
      toast.error("Please capture a selfie image");
      return;
    }

    try {
      setIsSubmitting(true);
      const base64Image = await convertToBase64(formData.selfieImage);

      const payload = {
        nin: formData.nin,
        selfie_image_base64: base64Image,
      };

      const response = await api.post("/user/kyc/", payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("KYC verification submitted successfully!");

        // Reset form
        setFormData({
          nin: "",
          selfieImage: null,
          selfiePreview: null,
        });

        if (userType == 'chw') {
          navigate("/chw")
        } else if (userType == 'nurse') {
          navigate("/nurse")
        } else{
          navigate("/patient")
        }
        
      } else {
        toast.error("Failed to submit KYC verification. Please try again.");
      }
    } catch (error: any) {
      console.error("Error submitting KYC:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to submit KYC verification. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.nin.length === 11 && formData.selfieImage;

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-4">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition duration-300"
          >
            <ArrowLeft className="text-gray-600 text-sm mr-2" />
            Back
          </button>
        </div>

        <div>
          <div className="flex items-center justify-center">
            <Heart className="text-green-600 text-3xl md:text-4xl" />
            <span className="text-xl font-bold ml-2">Toltimed</span>
          </div>

          <div className="flex justify-center mt-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="text-green-600 text-2xl" />
            </div>
          </div>

          <h2 className="mt-4 text-center text-3xl text-gray-900">
            KYC Verification
          </h2>
          <p className="text-gray-500 text-center mt-1">
            Complete your identity verification to continue
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="nin"
                className="block text-sm font-medium text-gray-700"
              >
                National Identification Number (NIN)
              </label>
              <div className="mt-1 relative">
                <input
                  id="nin"
                  name="nin"
                  type="text"
                  maxLength={11}
                  value={formData.nin}
                  onChange={handleNinChange}
                  className="block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter your 11-digit NIN"
                />
                <User className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              </div>
              {formData.nin.length > 0 && formData.nin.length < 11 && (
                <p className="mt-1 text-xs text-red-600">
                  NIN must be 11 digits ({formData.nin.length}/11)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selfie Image <span className="text-red-500">*</span>
              </label>

              {!formData.selfiePreview && !cameraMode && (
                <button
                  type="button"
                  onClick={() => setCameraMode(true)}
                  className="w-full border-2 border-dashed border-green-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors bg-green-50"
                >
                  <Camera className="mx-auto h-12 w-12 text-green-600" />
                  <p className="mt-2 text-sm font-medium text-green-700">
                    Take a Selfie
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Use your camera to capture
                  </p>
                </button>
              )}

              {cameraMode && (
                <div className="relative">
                  <div className="relative rounded-lg overflow-hidden border-2 border-green-500">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      onUserMediaError={handleUserMediaError}
                      className="w-full h-auto"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setCameraMode(false)}
                      className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {formData.selfiePreview && (
                <div className="mt-1 relative">
                  <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
                    <img
                      src={formData.selfiePreview}
                      alt="Selfie preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                          Image captured successfully
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Retake
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full bg-blue-50 border border-blue-200 py-4 px-4 rounded-lg">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="text-white text-sm" />
              </div>
              <div className="ml-3">
                <h3 className="text-blue-700 text-sm font-semibold">
                  Secure & Private
                </h3>
                <p className="text-blue-600 text-sm mt-1">
                  Your NIN and selfie are encrypted and used only for identity
                  verification. We comply with all data protection regulations.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition duration-300 ${
                isFormValid && !isSubmitting
                  ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Verifying..." : "Verify Identity"}
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 py-4 px-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Why do we need your NIN and selfie?
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• To verify your identity and ensure account security</li>
              <li>• To comply with regulatory requirements</li>
              <li>• To protect against fraud and unauthorized access</li>
              <li>• To enable secure healthcare service delivery</li>
              <li>• To match your face with your NIN records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
