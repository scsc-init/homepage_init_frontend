"use client";

import Link from "next/link";
import "./page.css";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function BoardPage({ board }) {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (order) => {
    setSortOrder(order);
    setDropdownOpen(false);
  };

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortOrder === "latest")
      return new Date(b.created_at) - new Date(a.created_at);
    if (sortOrder === "oldest")
      return new Date(a.created_at) - new Date(b.created_at);
    if (sortOrder === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <>
      {/* 드롭다운 UI */}
      <div className="SigSortDropdown" ref={dropdownRef}>
        <button
          className="SigSortBtn"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          정렬 ▼
        </button>
        {dropdownOpen && (
          <div className="SigSortMenu open">
            <button onClick={() => handleSortChange("latest")}>최신순</button>
            <button onClick={() => handleSortChange("oldest")}>
              오래된 순
            </button>
            <button onClick={() => handleSortChange("title")}>제목순</button>
          </div>
        )}
      </div>

      {/* 게시글 리스트 */}
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
    </>
  );
}
