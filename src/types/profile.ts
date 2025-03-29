
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  roles: string[] | null;
  location: string | null;
  country: string | null;
}
