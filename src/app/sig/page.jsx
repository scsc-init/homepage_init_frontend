// /app/sig/page.jsx - SIG 리스트 페이지 (디자인 단정화: 버튼화 + 링크 데코 완전 제거 + 읽기 좋은 글자)
import Link from "next/link";
import "./page.css";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";
9;
export default async function SigListPage() {
  const semesterMap = {
    1: "1",
    2: "S",
    3: "2",
    4: "W",
  };

  const res = await fetch(`${getBaseUrl()}/api/sigs`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>시그 정보를 불러올 수 없습니다.</div>;
  }

  const sigs = await res.json();
  if (!Array.isArray(sigs)) return <div>로딩중...</div>;

  sigs.sort((a, b) => b.id - a.id);

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
