"use client";

import Link from "next/link";
import "./board.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ArticlesView({ board, sortOrder }) {
  const router = useRouter();
  const [articles, setArticles] = useState([]);

  const boardId = board.id;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      alert("로그인이 필요합니다.");
      router.push("/us/login");
      return;
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
        const data = await contentRes.json();
        setArticles(data);
      } catch (e) {
        alert(`게시글 불러오기 중 오류: ${e}`);
        router.push("/");
      }
    };
    fetchContents();
  }, [router]);

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortOrder === "latest")
      return new Date(b.created_at) - new Date(a.created_at);
    if (sortOrder === "oldest")
      return new Date(a.created_at) - new Date(b.created_at);
    if (sortOrder === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div id="SigList">
      {sortedArticles.map((article) => (
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
              {article.content.replace(/\s+/g, " ").trim().slice(0, 80)}...
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
