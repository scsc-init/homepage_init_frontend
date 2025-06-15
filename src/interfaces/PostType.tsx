import { CommentType } from "./CommentType";
import { LifecyclePhase } from "./GlobalTypes";

export interface PostTypeWithComments {
  id: number;
  createdAt: string;
  updatedAt: string;
  postPhase: LifecyclePhase;
  postTitle: string;
  content: string;
  postAuthorId: number;
  boardId: number;
  postAuthor: string;
  comments: CommentType[];
}

export interface PostTypeWithoutComments {
  id: number;
  createdAt: string;
  updatedAt: string;
  postPhase: LifecyclePhase;
  postTitle: string;
  content: string;
  postAuthorId: number;
  boardId: number;
  postAuthor: string;
}
