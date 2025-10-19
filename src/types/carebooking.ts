export // First, update the CaregiverBooking interface to match the API response
interface CaregiverBookingInfo {
  id: string;
  booking_code: string;
  user: string;
  patient_name: string;
  patient_age: number;
  caregiver_type: string;
  duration: string;
  care_address: string;
  care_location: string;
  start_date: string;
  medical_condition: string;
  special_requirements: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  assigned_worker?: {
    id: string;
    email_address: string;
    first_name: string;
    last_name: string;
  };
  total_price: string;
  status: string;
  created_at: string;
  updated_at: string;
}


