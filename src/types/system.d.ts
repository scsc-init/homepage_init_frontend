// @/types/api-res.d.ts

export interface BoardInfo {
  id: number;
  name: string;
  description: string;
  writing_permission_level: number;
  reading_permission_level: number;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export type GlobalStatus = {
  id: number;
  year: number;
  semester: number;
  status: string;
  updated_at: string;
};

export interface KvFetchResponse {
  key: string;
  value?: string;
}

export type KvValueResult =
  | { status: 'fulfilled'; value: string }
  | { status: 'rejected'; reason: string };

export interface ArticleContentResponse {
  id?: number;
  content?: string;
  [key: string]: unknown;
}

export interface DiscordBotStatusResponse {
  logged_in?: boolean;
}

export interface MajorInfo {
  id: number;
  name: string;
  short_name?: string;
  [key: string]: unknown;
}

export type AcademicTerm = {
  year: number;
  semester: number;
};

export interface BaseTarget {
  id?: number;
  content_id?: number;
  title?: string;
  name?: string;
  label?: string;
  year?: number;
  semester?: number;
  status?: string;
  [key: string]: unknown;
}

export interface NormalizedTarget extends BaseTarget {
  title: string;
  status: string;
}
