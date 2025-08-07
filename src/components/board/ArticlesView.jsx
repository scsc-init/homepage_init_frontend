"use client";

import Link from "next/link";
import "./board.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ArticlesView({ board, sortOrder }) {
  const router = useRouter();
  const [articles, setArticles] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const boardId = board.id;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
      return;
    }

    if (boardId === 1 || boardId === 2) {
      setUnauthorized(true); // 상태로 표시
      return;
    }

    const fetchContents = async () => {
      try {
        const res = await fetch(`/api/articles/${boardId}`, {
          headers: { "x-jwt": jwt },
        });

        if (!res.ok) {
          router.push("/us/login");
          return;
        }

        const data = await res.json();
        setArticles(data);
      } catch (_) {
        router.push("/us/login");
      }
    };

    fetchContents();
  }, [router, boardId]);

  // 권한 없음
  if (unauthorized) {
    return (
      <div className="text-center text-red-600 mt-10">권한이 부족합니다.</div>
    );
  }

  // 로딩 중
  if (!Array.isArray(articles)) return null;

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
