import { PostTypeWithoutComments } from "./PostType";
import { UserType } from "./UserType";

export interface SimjiGroupType {
  id: number;
  isCompleted: boolean;
  simjiGroupTitle: string;
  description: string;
  thumbnail: null;
  boardId: number;
  simjiAuthors: UserType[];
  posts: PostTypeWithoutComments[];
}
