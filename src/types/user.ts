export type UserId = string;
export type UserRoleLevel = number;
export type MajorId = number;

export interface UserProfile {
  id: UserId;
  email: string;
  name: string;
  phone: string;
  student_id: string;
  role: UserRoleLevel;
  is_active: boolean;
  is_banned: boolean;
  major_id: MajorId;
  profile_picture_is_url: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
  discord_id?: number;
  discord_name?: string;
  profile_picture?: string;
  [key: string]: unknown;
}

export interface ExecutiveCandidate {
  id: UserId;
  email: string;
  name: string;
  role: UserRoleLevel;
  profile_picture_is_url: boolean;
  profile_picture?: string;
  [key: string]: unknown;
}

export interface UserSummary {
  id: UserId;
  name: string;
  major_id: MajorId;
  role: UserRoleLevel;
  is_active: boolean;
  is_banned: boolean;
  [key: string]: unknown;
}
