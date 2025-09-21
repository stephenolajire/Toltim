// types.ts
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

export interface Practitioner {
  user_id: string;
  full_name: string;
  specialization: string | null;
  latitude: number;
  longitude: number;
  verified_nurse: boolean;
  id: string;
  name: string;
  title: string;
  experience: string;
  rating: number;
  reviewCount: number;
  profileImage: string;
  location: string;
  distance: string;
  priceRange: string;
  languages: string[];
  qualifications: string[];
  services: string[];
  isVerified: boolean;
  responseTime: string;
  completedCases: number;
  availability: {
    date: string;
    slots: string[];
  }[];
  bio: string;
}

export interface BookingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  relationship: string;
}

export interface ScheduleConfig {
  frequency: "daily" | "specific-days" | "every-other-day" | "weekly";
  selectedDays: string[];
  startDate: string;
  timeSlot: string;
  totalDays: number;
}