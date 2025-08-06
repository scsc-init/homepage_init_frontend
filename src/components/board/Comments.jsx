"use client";

import SortDropdown from "./SortDropdown";
import ArticlesView from "./ArticlesView";
import "./board.css";

export default function BoardClient({
  board,
  onlyActions = false,
  sortOrder,
  setSortOrder,
}) {
  if (onlyActions) {
    return (
      <div className="SigActions">
        <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
        <a href={`/board/${board.id}/create`} id="SigCreateButton">
          <button className="SigCreateBtn">글 작성</button>
        </a>
      </div>
    );
  }

  return <ArticlesView board={board} sortOrder={sortOrder} />;
}
