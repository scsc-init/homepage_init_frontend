"use client";

import { useState } from "react";
import SortDropdown from "@/components/board/SortDropdown";
import Link from "next/link";

export default function SigListClient({ sigs }) {
  const [sortOrder, setSortOrder] = useState("latest");

  const sortedSigs = [...sigs].sort((a, b) => {
    if (sortOrder === "latest") return b.id - a.id;
    if (sortOrder === "oldest") return a.id - b.id;
    if (sortOrder === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  const semesterMap = { 1: "1", 2: "S", 3: "2", 4: "W" };

  return (
    <>
      <div className="SigHeader">
        <h1 className="text-3xl font-bold">SIG 게시판</h1>
        <div className="SigHeaderActions">
          <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <Link href="/sig/create" id="SigCreateButton">
            <button className="SigCreateBtn">SIG 만들기</button>
          </Link>
        </div>
      </div>

      <div id="SigList">
        {sortedSigs.map((sig) => (
          <Link key={sig.id} href={`/sig/${sig.id}`} className="sigLink">
            <div className="sigCard">
              <div className="sigTopbar">
                <span className="sigTitle">{sig.title}</span>
                <span className="sigUserCount">
                  {sig.year}년 {semesterMap[sig.semester]}학기
                </span>
              </div>
              <div className="sigDescription">{sig.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
