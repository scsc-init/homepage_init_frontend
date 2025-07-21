// /app/pig/page.jsx - PIG 리스트 페이지 (디자인 단정화: 버튼화 + 링크 데코 완전 제거 + 읽기 좋은 글자)
"use client";

import Link from "next/link";
import "./page.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PigListPage() {
  const [pigs, setPigs] = useState();

  const router = useRouter();

  const semesterMap = {
    1: "1",
    2: "S",
    3: "2",
    4: "W",
  }

  useEffect(() => {
    const setData = async () => {
      const res = await fetch(`/api/pigs`, {
      });
    
      if (!res.ok) {
        alert("피그 정보를 불러올 수 없습니다.");
        router.push('/');
      }
    
      const pigs = await res.json();
      setPigs(pigs);
    };
    setData();
  }, [router]);

  useEffect(() => {
    if (!pigs) return;
    setPigs([...pigs].sort((a, b) => a.id - b.id));
  }, [pigs]);

  if (!pigs) return <div>로딩중...</div>

  return (
    <div id="PigListContainer">
      <div className="PigHeader">
        <h1 className="text-3xl font-bold">PIG 게시판</h1>
        <Link href="/pig/create" id="PigCreateButton">
          <button className="PigCreateBtn">PIG 만들기</button>
        </Link>
      </div>

      <div id="PigList">
        {pigs.map((pig) => (
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
    </div>
  );
}
