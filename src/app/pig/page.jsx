// /app/pig/page.jsx - PIG 리스트 페이지 (디자인 단정화: 버튼화 + 링크 데코 완전 제거 + 읽기 좋은 글자)
import Link from "next/link";
import "./page.css";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export default async function PigListPage() {
  const semesterMap = {
    1: "1",
    2: "S",
    3: "2",
    4: "W",
  }

  const res = await fetch(`${getBaseUrl()}/api/pigs`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>피그 정보를 불러올 수 없습니다.</div>
  }

  const pigs = await res.json();
  if (!Array.isArray(pigs)) return <div>로딩중...</div>

  pigs.sort((a, b) => b.id - a.id);

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
