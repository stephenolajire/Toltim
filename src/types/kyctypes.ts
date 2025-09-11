export interface PersonalInfo {
  licenseNumber: string;
  yearsExperience: string;
  specialization: string;
  nursingSchool: string;
  graduationYear: string;
}

export interface EmploymentInfo {
  workplace: string;
  workAddress: string;
  biography: string;
  emergencyContact: string;
}

export interface RequiredDocuments {
  nursingLicense: File | null;
  resume: File | null;
  governmentId: File | null;
  certificates: File | null;
  employmentLetter: File | null;
  photo: File | null;
}

export interface KycStage {
  id: number;
  title: string;
  description: string;
  status: "pending" | "current" | "completed" | "review";
  icon: React.ReactNode;
}
