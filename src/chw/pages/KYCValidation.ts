// validations/kycValidation.ts
import * as Yup from "yup";

export const personalInfoSchema = Yup.object().shape({
  licenseNumber: Yup.string()
    .required("Nursing license number is required")
    .min(3, "License number must be at least 3 characters"),
  yearsExperience: Yup.string().required("Years of experience is required"),
  specialization: Yup.string().required("Specialization is required"),
  nursingSchool: Yup.string()
    .required("Nursing school is required")
    .min(3, "School name must be at least 3 characters"),
  graduationYear: Yup.string()
    .required("Graduation year is required")
    .matches(/^\d{4}$/, "Please enter a valid 4-digit year")
    .test(
      "year-range",
      "Year must be between 1980 and current year",
      (value) => {
        const year = parseInt(value || "0");
        const currentYear = new Date().getFullYear();
        return year >= 1980 && year <= currentYear;
      }
    ),
});

export const employmentInfoSchema = Yup.object().shape({
  workplace: Yup.string()
    .required("Current/Last workplace is required")
    .min(3, "Workplace name must be at least 3 characters"),
  workAddress: Yup.string()
    .required("Work address is required")
    .min(10, "Please provide a complete address"),
  biography: Yup.string()
    .required("Professional biography is required")
    .min(50, "Biography must be at least 50 characters")
    .max(500, "Biography must not exceed 500 characters"),
  emergencyContact: Yup.string()
    .required("Emergency contact is required")
    .min(10, "Please provide complete contact information"),
});

export const documentsSchema = Yup.object().shape({
  nursingLicense: Yup.mixed()
    .required("Nursing license document is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return !value || (value as File).size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only PDF, JPG, JPEG, PNG files are allowed", (value) => {
      if (!value) return false;
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      return allowedTypes.includes((value as File).type);
    }),
  resume: Yup.mixed()
    .required("Resume/CV is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return !value || (value as File).size <= 5 * 1024 * 1024;
    }),
  governmentId: Yup.mixed()
    .required("Government ID is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return !value || (value as File).size <= 5 * 1024 * 1024;
    }),
  certificates: Yup.mixed()
    .required("Professional certificates are required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return !value || (value as File).size <= 5 * 1024 * 1024;
    }),
  employmentLetter: Yup.mixed()
    .required("Employment letter is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return !value || (value as File).size <= 5 * 1024 * 1024;
    }),
  photo: Yup.mixed()
    .required("Professional photo is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return !value || (value as File).size <= 5 * 1024 * 1024;
    }),
});
