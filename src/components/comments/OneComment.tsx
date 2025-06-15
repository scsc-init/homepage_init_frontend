import { useState } from "react";
import "./OneComment.css";
// import TextArea from "../mantle-ui/components/textarea/TextArea";
import * as Button from "@/components/Button";

interface SimpleOneCommentType {
  content: string;
  comment_author: string;
  created_at: string;
  is_child_comment: boolean;
  changeParentCommentId: (id: number) => void;
}

// TODO 댓글의 댓글 구현

export default function OneComment({
  content,
  comment_author,
  created_at,
  is_child_comment,
  changeParentCommentId,
}: SimpleOneCommentType) {
  const [isSelectOn, setIsSelectOn] = useState(false);

  const handleSelect = () => {
    setIsSelectOn((prev) => !prev);
  };

  const [commentContent, setCommentContent] = useState(content);

  const handleCommentContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCommentContent(event.target.value);
  };

  return (
    <div className={"one-comment-wrapper " + (is_child_comment ? "child" : "")}>
      <div className="author-wrapper">{comment_author}</div>
      <div className="text-wrapper">{content}</div>

      <div className="date-wrapper">{created_at}</div>
      <div className="select-box">
        <div className="select-wrapper" onClick={handleSelect}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M144 128a16 16 0 1 1-16-16a16 16 0 0 1 16 16m-84-16a16 16 0 1 0 16 16a16 16 0 0 0-16-16m136 0a16 16 0 1 0 16 16a16 16 0 0 0-16-16"
            />
          </svg>
          <div
            className="select-options-wrapper"
            style={{ display: isSelectOn ? "block" : "none" }}
          >
            {/* TODO 댓글의 id를 여기에 넣기 */}
            <div
              className="select-options-item"
              onClick={() => {
                changeParentCommentId(1);
              }}
            >
              댓글 수정
            </div>
            <div className="select-options-item">댓글 삭제</div>
          </div>
        </div>
      </div>
    </div>
  );
}
