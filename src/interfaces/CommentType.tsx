export interface CommentType {
  id: number;
  created_at: string;
  updated_at: string;
  content: string;
  hidden: boolean;
  user_id: number;
  parent_id: number;
  post_id: number;
}

export interface FrontendCommentType extends CommentType {
  is_child_comment: boolean;
  comment_author: string;
}
