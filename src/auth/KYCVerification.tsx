import { useState, useRef } from "react";
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
import {toast} from "react-toastify"

const KYCVerification = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setCameraMode(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.info(
        "Unable to access camera. Please check permissions or use file upload."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraMode(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            const previewUrl = URL.createObjectURL(blob);

            setFormData((prev) => ({
              ...prev,
              selfieImage: file,
              selfiePreview: previewUrl,
            }));

            stopCamera();
          }
        },
        "image/jpeg",
        0.9
      );
    }
  };

  const handleNinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setFormData((prev) => ({ ...prev, nin: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.info("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.info("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          selfieImage: file,
          selfiePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      selfieImage: null,
      selfiePreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nin || formData.nin.length !== 11) {
      toast.error("Please enter a valid 11-digit NIN");
      return;
    }

    if (!formData.selfieImage) {
      toast.info("Please upload a selfie image");
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
      if (response.status === 200) {
        toast.success("KYC verification submitted successfully!");
      } else {
        toast.error("Failed to submit KYC verification. Please try again.");
      }


      setFormData({
        nin: "",
        selfieImage: null,
        selfiePreview: null,
      });
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.nin.length === 11 && formData.selfieImage;

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
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={startCamera}
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

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
                  >
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Upload from device
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}

              {cameraMode && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg border-2 border-green-500"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
                    >
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
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

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Need help finding your NIN?
            </p>
            <a
              href="/support"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
