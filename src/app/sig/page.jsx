// /app/sig/page.jsx - SIG 리스트 페이지 (디자인 단정화: 버튼화 + 링크 데코 완전 제거 + 읽기 좋은 글자)
import Link from "next/link";
import "./page.css";

export default async function SigListPage() {
  const res = await fetch("http://localhost:8080/api/sigs", {
    method: "GET",
    headers: { "x-api-secret": "some-secret-code" },
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="text-center text-red-600 mt-10">
        시그 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const sigs = await res.json();

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
                  {sig.year}년 {sig.semester}학기
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
