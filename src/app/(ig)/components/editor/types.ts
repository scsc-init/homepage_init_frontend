export type IgKind = 'sig' | 'pig';

export type AdmissionMode = 'always' | 'during_recruiting' | 'never';

export type WebsiteFormValue = {
  url: string;
};

export type IgFormValues = {
  title: string;
  description: string;
  editor: string;
  should_extend: boolean;
  is_rolling_admission: AdmissionMode;
  websites: WebsiteFormValue[];
};

export type IgTag = {
  id: string | number;
  text?: string | null;
  is_major?: boolean | null;
};

export type IgArticle = {
  content?: string | null;
  [key: string]: unknown;
};

export type IgItem = {
  id?: string | number;
  title?: string | null;
  description?: string | null;
  should_extend?: boolean | null;
  is_rolling_admission?: string | null;
  websites?: unknown[];
  tags?: IgTag[];
  content?: IgArticle | string | null;
  [key: string]: unknown;
};

export type SigTagManagerHandle = {
  syncTags: () => Promise<void>;
};

export function isAdmissionMode(value: unknown): value is AdmissionMode {
  return value === 'always' || value === 'during_recruiting' || value === 'never';
}
