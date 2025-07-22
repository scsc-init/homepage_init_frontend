//중요!!! 현재 모든 클래스를 sig에서 재활용하고 있으므로, componentization된 부분을 포함해 클래스명을 sig로 유지하고 있습니다.
//이는 배포 이전에, 디자인 수정을 포함한 기능 수정시의 편의를 위한 것이고 실제 배포시에는 유지보수를 위해 componetization을 진행하거나 이름을 바꿀 예정입니다.

"use client";

import Link from "next/link";
import "./page.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BoardPage({ board }) {
  const router = useRouter();
  const [articles, setArticles] = useState();

  const boardId = board.id;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      alert("로그인이 필요합니다.");
      router.push("/us/login"); return;
    }

    const fetchContents = async () => {
      try {
        const contentRes = await fetch(`/api/articles/${boardId}`, {
          headers: { "x-jwt": jwt },
        });
        if (!contentRes.ok) {
          alert("게시글 로딩 실패");
          router.push("/");
        }
        const articles = await contentRes.json();
        setArticles(articles);
      } catch (e) {
        alert(`게시글 불러오기 중 오류: ${e}`);
        router.push("/");
      }
    };
    fetchContents();
  }, [router]);

  if (!articles || !board || boardId == 1 || boardId == 2) {
    return (
      <div className="text-center text-red-600 mt-10">
        게시글을 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div id="SigList">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/article/${article.id}`}
          className="sigLink"
        >
          <div className="sigCard">
            <div className="sigTopbar">
              <span className="sigTitle">{article.title}</span>
              <span className="sigUserCount">
                {new Date(article.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="sigDescription">
              {article.content.slice(0, 80)}...
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
