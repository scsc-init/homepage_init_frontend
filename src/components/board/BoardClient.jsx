"use client";

import { useState } from "react";
import SortDropdown from "./SortDropdown";
import ArticlesView from "./ArticlesView";
import "./board.css";

export default function BoardClient({ board }) {
  const [sortOrder, setSortOrder] = useState("latest");

  return (
    <>
      {/* 상단 버튼 영역 */}
      <div className="SigActions">
        <div className="left-action">
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>
        <div className="right-action">
          <a href={`/board/${board.id}/create`} id="SigCreateButton">
            <button className="SigCreateBtn">글 작성</button>
          </a>
        </div>
      </div>

      {/* 글 목록 */}
      <ArticlesView board={board} sortOrder={sortOrder} />
    </>
  );
}
