"use client";

import { useState } from "react";
import SortDropdown from "@/components/board/SortDropdown"; // 기존 재사용
import Link from "next/link";

export default function PigListClient({ pigs }) {
  const [sortOrder, setSortOrder] = useState("latest");

  const sortedPigs = [...pigs].sort((a, b) => {
    if (sortOrder === "latest") return b.id - a.id;
    if (sortOrder === "oldest") return a.id - b.id;
    if (sortOrder === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  const semesterMap = { 1: "1", 2: "S", 3: "2", 4: "W" };

  return (
    <>
      <div className="PigHeader">
        <h1 className="text-3xl font-bold">PIG 게시판</h1>
        <div className="PigHeaderActions">
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <Link href="/pig/create" id="PigCreateButton">
            <button className="PigCreateBtn">PIG 만들기</button>
          </Link>
        </div>
      </div>

      <div id="PigList">
        {sortedPigs.map((pig) => (
          <Link key={pig.id} href={`/pig/${pig.id}`} className="pigLink">
            <div className="pigCard">
              <div className="pigTopbar">
                <span className="pigTitle">{pig.title}</span>
                <span className="pigUserCount">
                  {pig.year}년 {semesterMap[pig.semester]}학기
                </span>
              </div>
              <div className="pigDescription">{pig.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
