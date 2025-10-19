export interface Patient {
  id: string;
  email_address: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  profile_picture: string | null;
  role: string;
}
