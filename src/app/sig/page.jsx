// /app/sig/page.jsx - SIG 리스트 페이지 (디자인 단정화: 버튼화 + 링크 데코 완전 제거 + 읽기 좋은 글자)
"use client";

import Link from "next/link";
import "./page.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SigListPage() {
  const [sigs, setSigs] = useState();

  const router = useRouter();

  const semesterMap = {
    1: "1",
    2: "S",
    3: "2",
    4: "W",
  }

  useEffect(() => {
    const setData = async () => {
      const res = await fetch(`/api/sigs`, {
      });
    
      if (!res.ok) {
        alert("시그 정보를 불러올 수 없습니다.");
        router.push('/');
      }
    
      const sigs = await res.json();
      setSigs(sigs);
    };
    setData();
  }, [router]);

  useEffect(() => {
    if (!sigs) return;
    setSigs([...sigs].sort((a, b) => a.id - b.id));
  }, [sigs]);

  if (!sigs) return <div>로딩중...</div>

  return (
    <div id="SigListContainer">
      <div className="SigHeader">
        <h1 className="text-3xl font-bold">SIG 게시판</h1>
        <Link href="/sig/create" id="SigCreateButton">
          <button className="SigCreateBtn">SIG 만들기</button>
        </Link>
      </div>

      <div id="SigList">
        {sigs.map((sig) => (
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
    </div>
  );
}
