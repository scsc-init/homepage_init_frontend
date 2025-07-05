"use client";

import React, { useState } from "react";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export default function ArticleList({
  boards: boardsDefault,
  articles: articlesDefault,
}) {
  const [boards, setBoards] = useState(boardsDefault ?? []);
  const [articles, setArticles] = useState(articlesDefault ?? {});
  const [saving, setSaving] = useState({});

  const handleBoardChange = (id, value) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, name: value } : b)),
    );
  };

  const handleArticleChange = (boardId, id, field, value) => {
    setArticles((prev) => ({
      ...prev,
      [boardId]: prev[boardId].map((a) =>
        a.id === id ? { ...a, [field]: value } : a,
      ),
    }));
  };

  const saveBoard = async (board) => {
    const res = await fetch(
      `${getBaseUrl()}/api/executive/board/update/${board.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": getApiSecret(),
          "x-jwt": localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ name: board.name }),
      },
    );

    if (res.status === 204) {
      alert("게시판 이름 수정 완료");
    } else {
      alert("게시판 이름 수정 실패: " + res.status);
    }
  };

  const deleteBoard = async (id) => {
    const ok = confirm("게시판을 삭제하시겠습니까?");
    if (!ok) return;

    const res = await fetch(
      `${getBaseUrl()}/api/executive/board/delete/${id}`,
      {
        method: "POST",
        headers: {
          "x-api-secret": getApiSecret(),
          "x-jwt": localStorage.getItem("jwt"),
        },
      },
    );

    if (res.status === 204) {
      alert("삭제 완료");
      setBoards((prev) => prev.filter((b) => b.id !== id));
    } else {
      alert("삭제 실패: " + res.status);
    }
  };

  const saveArticle = async (article) => {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 필드 검증
    if (!article.title || !article.content || !article.board_id) {
      alert("제목, 내용, 게시판 ID는 필수입니다.");
      return;
    }

    const payload = {
      title: article.title.trim(),
      content: article.content.trim(),
      board_id: Number(article.board_id),
    };

    console.log("🚀 최종 전송 payload", payload);

    try {
      const res = await fetch(
        `${getBaseUrl()}/api/executive/article/update/${article.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-secret": getApiSecret(),
            "x-jwt": jwt,
          },
          body: JSON.stringify(payload),
        },
      );

      if (res.status === 204) {
        alert("✅ 게시글 수정 완료");
      } else {
        const error = await res.text();
        console.error("❌ 수정 실패 응답:", error);
        alert("수정 실패: " + (error || res.status));
      }
    } catch (err) {
      console.error("💥 네트워크 또는 JSON 오류", err);
      alert("요청 실패: " + err.message);
    }
  };

  const deleteArticle = async (id, boardId) => {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    const res = await fetch(
      `${getBaseUrl()}/api/executive/article/delete/${id}`,
      {
        method: "POST",
        headers: {
          "x-api-secret": getApiSecret(),
          "x-jwt": localStorage.getItem("jwt"),
        },
      },
    );

    if (res.status === 204) {
      setArticles((prev) => ({
        ...prev,
        [boardId]: prev[boardId].filter((a) => a.id !== id),
      }));
    } else {
      alert("삭제 실패: " + res.status);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      {boards.map((board) => (
        <div key={board.id} style={{ marginBottom: "3rem" }}>
          <h3>게시판 ID {board.id}</h3>
          <div style={{ marginBottom: "1rem" }}>
            <input
              value={board.name}
              onChange={(e) => handleBoardChange(board.id, e.target.value)}
            />
            <button
              onClick={() => saveBoard(board)}
              style={{ marginLeft: "0.5rem" }}
            >
              이름 저장
            </button>
            <button
              onClick={() => deleteBoard(board.id)}
              style={{ marginLeft: "0.5rem" }}
            >
              게시판 삭제
            </button>
          </div>

          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>제목</th>
                <th style={thStyle}>내용</th>
                <th style={thStyle}>작업</th>
              </tr>
            </thead>
            <tbody>
              {(articles[board.id] || []).map((article) => (
                <tr key={article.id}>
                  <td style={tdStyle}>{article.id}</td>
                  <td style={tdStyle}>
                    <input
                      value={article.title}
                      onChange={(e) =>
                        handleArticleChange(
                          board.id,
                          article.id,
                          "title",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      value={article.content}
                      onChange={(e) =>
                        handleArticleChange(
                          board.id,
                          article.id,
                          "content",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => saveArticle(article)}
                      disabled={saving[article.id]}
                    >
                      저장
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id, board.id)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f9f9f9",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};
