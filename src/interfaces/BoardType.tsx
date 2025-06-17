import { LifecyclePhase } from "./GlobalTypes";
import { PostTypeWithComments } from "./PostType";

export interface BoardType {
  id: number;
  createdAt: string;
  updatedAt: string;
  boardPhase: LifecyclePhase;
  boardTitle: string;
  ownerId: number | null;
  owner: string | null;
  posts: PostTypeWithComments[];
  simji: null;
  sig: null;
}
