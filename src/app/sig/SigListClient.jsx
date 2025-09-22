"use client";

import SortDropdown from "@/components/board/SortDropdown";
import { SEMESTER_MAP } from "@/util/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SigListClient({ sigs }) {
  const [sortOrder, setSortOrder] = useState("latest");
  const [mySigIds, setMySigIds] = useState(() => new Set());

  const sortedSigs = [...sigs].sort((a, b) => {
    if (sortOrder === "latest") return b.id - a.id;
    if (sortOrder === "oldest") return a.id - b.id;
    if (sortOrder === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || sigs.length === 0) {
      setMySigIds(new Set());
      return;
    }

    const controller = new AbortController();

    async function loadMemberships() {
      try {
        const meRes = await fetch("/api/user/profile", {
          headers: { "x-jwt": jwt },
          signal: controller.signal,
        });
        if (!meRes.ok) return;

        const me = await meRes.json();
        const myId = me?.id ? String(me.id) : "";
        if (!myId) return;

        const membershipResults = await Promise.allSettled(
          sigs.map(async (sig) => {
            const res = await fetch(`/api/sig/${sig.id}/members`, {
              headers: { "x-jwt": jwt },
              signal: controller.signal,
            });
            if (!res.ok) return null;

            const members = await res.json();
            const hasMe =
              Array.isArray(members) &&
              members.some((member) => {
                const memberId = member?.user_id ?? member?.id ?? member?.user?.id;
                return memberId != null && String(memberId) === myId;
              });
            return hasMe ? String(sig.id) : null;
          })
        );

        if (controller.signal.aborted) return;

        const nextSet = new Set(
          membershipResults
            .filter((result) => result.status === "fulfilled" && result.value)
            .map((result) => /** @type {PromiseFulfilledResult<string>} */ (result).value)
        );
        setMySigIds(nextSet);
      } catch (error) {
        if (error?.name !== "AbortError") {
          /* ignore other errors */
        }
      }
    }

    loadMemberships();

    return () => controller.abort();
  }, [sigs]);

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
        {sortedSigs.map((sig) => {
          const sid = String(sig.id);
          const isMine = mySigIds.has(sid);
          return (
            <Link key={sig.id} href={`/sig/${sig.id}`} className="sigLink">
              <div className={`sigCard ${isMine ? "isMine" : ""}`}>
                <div className="sigTopbar">
                  <span className="sigTitle">{sig.title}</span>
                  <span className="sigUserCount">
                    {sig.year}년 {SEMESTER_MAP[sig.semester]}학기
                  </span>
                </div>
                <div className="sigDescription">{sig.description}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
