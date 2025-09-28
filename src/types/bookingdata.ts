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
  total_amount: string;
  updated_at: string;
  user: string;
}
