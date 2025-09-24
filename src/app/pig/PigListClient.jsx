"use client";

import SortDropdown from "@/components/board/SortDropdown"; // 기존 재사용
import { SEMESTER_MAP } from "@/util/constants";
import Link from "next/link";
import { useState,useEffect } from "react";

export default function PigListClient({ pigs }) {
  const [sortOrder, setSortOrder] = useState("latest");
  const [myOwnedPigIds, setMyOwnedPigIds] = useState(() => new Set());

  const sortedPigs = [...pigs].sort((a, b) => {
    if (sortOrder === 'latest') return b.id - a.id;
    if (sortOrder === 'oldest') return a.id - b.id;
    if (sortOrder === 'title') return a.title.localeCompare(b.title);
    return 0;
  });
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || pigs.length === 0) {
      setMyOwnedPigIds(new Set());
      return;
    }

    const controller = new AbortController();

    async function loadOwnedPigs() {
      try {
        const meRes = await fetch("/api/user/profile", {
          cache: "no-cache",
          headers: { "x-jwt": jwt },
          signal: controller.signal,
        });
        if (!meRes.ok) return;

        const me = await meRes.json();
        const myId = me?.id ? String(me.id) : "";
        if (!myId) return;

        const nextSet = new Set(
          pigs
            .filter((pig) => pig?.owner && String(pig.owner) === myId)
            .map((pig) => String(pig.id))
        );

        if (!controller.signal.aborted) setMyOwnedPigIds(nextSet);
      } catch (error) {
        if (error?.name !== "AbortError") {
          /* ignore other errors */
        }
      }
    }

    loadOwnedPigs();

    return () => controller.abort();
  }, [pigs]);

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
        {sortedPigs.map((pig) => {
          const pid = String(pig.id);
          const isMine = myOwnedPigIds.has(pid);
          return (
          <Link key={pig.id} href={`/pig/${pig.id}`} className="pigLink">
            <div className={`pigCard ${isMine ? "isMine" : ""}`}>
              <div className="pigTopbar">
                <span className="pigTitle">{pig.title}</span>
                <span className="pigUserCount">
                  {pig.year}년 {SEMESTER_MAP[pig.semester]}학기
                </span>
              </div>
              <div className="pigDescription">{pig.description}</div>
            </div>
          </Link>
        );
      })}
      </div>
    </>
  );
}
