export interface BookingData {
  booking_id: string;
  created_at: string;
  draft_sessions:number;
  total_sessions:number;
  id: number;
  is_for_self: boolean;
  nurse: string;
  nurse_full_name: string;
  patient_detail: {
    address: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    relationship_to_patient: string;
  };
  procedure_item: {
    num_days: number;
    procedure: {
      created_at: string;
      description: string;
      duration: string;
      icon_url: string | null;
      id: number;
      inclusions: Array<{
        id: number;
        item: string;
      }>;
      price: string;
      procedure_id: string;
      repeated_visits: boolean;
      requirements: Array<{
        id: number;
        item: string;
      }>;
      status: string;
      title: string;
      updated_at: string;
    };
    procedure_id: number;
    subtotal: string;
  };
  scheduling_option: string;
  selected_days: string[] | null;
  service_address: string;
  service_dates: string[];
  service_location: string;
  start_date: string;
  status: string;
  time_of_day: string;
  total_amount_display: string;
  updated_at: string;
  user: string;
  test_result:string;
}

export interface Booking {
  id: number;
  booking_id: string;
  user: string;
  nurse: string;
  nurse_full_name?: string;
  scheduling_option: string;
  start_date: string;
  time_of_day: string;
  selected_days: string[];
  service_dates: string[];
  is_for_self: boolean;
  total_sessions:number;
  draft_sessions:number;
  reviewed:boolean;
  status: "pending" | "accepted" | "active" | "completed" | "rejected";
  total_amount: string;
  procedure_item: {
    procedure: {
      id: number;
      procedure_id: string;
      title: string;
      description: string;
      duration: string;
      repeated_visits: boolean;
      price: string;
      icon_url: string;
      status: string;
      inclusions?: Array<{ id: number; item: string }>;
      requirements?: Array<{ id: number; item: string }>;
      created_at: string;
      updated_at: string;
    };
    procedure_id: number;
    num_days: number;
    subtotal: string;
  };
  patient_detail?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    relationship_to_patient: string;
  };
  service_address: string;
  service_location: string;
  created_at: string;
  updated_at: string;
  total_amount_display: string;
  test_result:string;
}


export interface CaregiverBookingData {
  id: string;
  user: string;
  caregiver_type: string;
  duration: string;
  patient_name: string;
  patient_age: number;
  medical_condition: string;
  care_location: string;
  care_address: string;
  start_date: string;
  total_price: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  special_requirements: string;
  status: "pending" | "assigned" | "active" | "completed" | "cancelled" | "approved";
  assigned_worker:
    | string
    | {
        id: string;
        first_name: string;
        last_name: string;
        email_address: string;
      }
    | null;
  created_at: string;
  updated_at: string;
}

export interface Specialization {
  id: number;
  name: string;
}

export interface Review {
  id: string;
  nurse_profile: number;
  nurse_name: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface NearbyWorker {
  id: number;
  user_id: string;
  full_name: string;
  profile_picture?: string | null;
  specialization: Specialization[];
  biography: string;
  services: string[];
  availability: string[];
  languages: string[];
  verified_nurse: boolean;
  price_range: string | null;
  completed_cases: number;
  rating: number;
  active: boolean;
  review_count: number;
  latest_reviews: Review[];
  distance_away: number;
  latitude: number;
  longitude: number;
  // Optional legacy fields for backward compatibility
  user?: string;
  distance?: number;
  location?: string;
  years_of_experience?: number;
  available?: boolean;
  verified_chw?: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  appointmentType: string;
  time: string;
  location: string;
  status: "pending" | "assigned" | "active" | "completed";
  assignedNurse?: string;
}

export interface CHWInfo {
  id: string;
  email_address: string;
  first_name: string;
  full_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string | null;
}

export interface ServiceItem {
  service: string;
  price_per_day: string;
}

export interface BedsideBooking {
  id: string;
  user: string;
  chw: string;
  chw_info: CHWInfo;
  patient_name: string;
  hospital_name: string;
  hospital_address: string;
  room_ward: string;
  admission_date: string;
  expected_discharge: string;
  number_of_days: number;
  items: ServiceItem[];
  special_requirements: string;
  total_cost: string;
  status: "pending" | "assigned" | "active" | "completed";
  created_at: string;
  updated_at: string;
  user_location?: string | null;
}