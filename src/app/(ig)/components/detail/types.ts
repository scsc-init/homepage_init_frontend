import type { UserId } from '@/types/user';

export type IgKind = 'sig' | 'small-group' | 'pig';

export type IgParams = Promise<{ id: string }>;

export interface IgMember {
  id?: UserId;
  user_id?: UserId;
  name: string;
  is_active?: boolean;
  user?: never;
}

export interface IgWebsite {
  id?: number;
  label?: string | null;
  url: string;
}

export interface IgDetail {
  title: string;
  description: string;
  owner: UserId;
  year: number;
  semester: number;
  created_year?: number | null;
  created_semester?: number | null;
  status: string;
  is_rolling_admission: string;
  tags?: { id: number; text: string; is_major: boolean }[];
  websites?: IgWebsite[];
  members?: (IgMember | { user: IgMember })[] | null;
  content?: { content: string } | null;
}
