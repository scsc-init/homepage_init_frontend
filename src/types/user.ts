export interface UserProfile {
  id?: number | string;
  email?: string | null;
  name?: string | null;
  student_id?: string | null;
  phone?: string | null;
  major?: string | null;
  role?: string | number | null;
  status?: string | null;
  profile_picture?: string | null;
  profile_picture_is_url?: boolean | null;
  [key: string]: unknown;
}
export interface ExecutiveCandidate {
  id?: string | number | null;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  [key: string]: unknown;
}
