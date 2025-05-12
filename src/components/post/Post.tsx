import Text from "@/components/post/Text";
import TitleAuthor from "./TitleAuthor";

import "./Post.css";

interface PostProps {
  postTitle: string;
  postAuthor: string;
  content: string;
}

export default function Post({
  postTitle,
  postAuthor,
  content,
}: PostProps) {
  return (
    <>
      <TitleAuthor postTitle={postTitle} postAuthor={postAuthor} />
      <Text content={content} />
    </>
  );
}
