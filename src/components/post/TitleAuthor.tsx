import Divider from "@/components/Divider";
import "./TitleAuthor.css";
import Title from "../Title";

interface TitleAuthorType {
  postTitle: string;
  postAuthor: string;
}

export default function TitleAuthor({
  postTitle,
  postAuthor,
}: TitleAuthorType) {
  return (
    <>
      <Title text={postTitle} />
      <div className="author-div">작성자: {postAuthor}</div>
      <Divider />
    </>
  );
}
