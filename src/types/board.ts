import type { SortOrder } from '@/components/common/SortDropdown';

export interface Board {
  id: number;
  name: string;
  description: string;
  writing_permission_level: number;
  reading_permission_level: number;
  board_type: 'TEXT' | 'NONE' | 'FILE' | 'IMAGE';
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: number;
  article_id: number;
  file_id: string;
}

export interface Article {
  id: number;
  title: string;
  author_id: string;
  board_id: number;
  created_at: string;
  updated_at: string;
  content: string | null;
  attachments: Attachment[];
  is_deleted?: boolean;
}

export interface ArticleComment {
  id: number;
  content: string;
  author_id: string;
  article_id: number;
  parent_id: number | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface FileMetadata {
  id: string;
  original_filename: string;
  size: number;
  mime_type: string;
  owner?: string | null;
  created_at: string;
  // Keep support for older metadata responses keyed by file_id.
  file_id?: string;
}

export interface BoardViewProps {
  board: Board;
  sortOrder: SortOrder;
}

export interface ArticleFormValues {
  title: string;
  editor: string;
}

export interface AttachmentFormValues {
  title: string;
  description: string;
}

export interface ArticleSubmission extends ArticleFormValues {
  attachments: string[];
}

export interface ArticleWriteRequest {
  title: string;
  content: string;
  board_id: number;
  attachments: string[];
}

export interface WriteEditorProps {
  boardInfo?: Board;
  onSubmit: (data: ArticleSubmission) => void | Promise<void>;
  submitting: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}
