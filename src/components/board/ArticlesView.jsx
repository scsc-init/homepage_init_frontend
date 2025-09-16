"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UTC2KST } from "@/util/constants";
import "./board.css";

export default function ArticlesView({ board, sortOrder }) {
  const router = useRouter();
  const [articles, setArticles] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const boardId = board?.id; // board가 없으면 undefined

  useEffect(() => {
    if (!boardId) return; // board 없을 경우 실행하지 않음

    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
      return;
    }

    if (boardId === 1 || boardId === 2) {
      setUnauthorized(true);
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

  if (!board) {
    return (
      <div className="text-center text-red-600 mt-10">
        게시판 정보가 없습니다.
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="text-center text-red-600 mt-10">권한이 부족합니다.</div>
    );
  }

  if (!Array.isArray(articles)) return <LoadingSpinner />;

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
                {UTC2KST(new Date(article.created_at))}
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
