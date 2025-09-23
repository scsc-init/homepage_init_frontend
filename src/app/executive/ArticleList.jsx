'use client';
import React, { useEffect, useState } from 'react';

export default function ArticleList({ boards: boardsDefault }) {
  const [boards, setBoards] = useState(boardsDefault ?? []);
  const [articles, setArticles] = useState({});
  const [saving, setSaving] = useState({});

  useEffect(() => {
    async function fetchBoardArticles(boardId) {
      const res = await fetch(`/api/articles/${boardId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) return { [boardId]: await res.json() };
      return {};
    }

    const ids = boards.map((b) => b.id);
    if (!ids.length) return;

    Promise.all(ids.map(fetchBoardArticles)).then((resArray) => {
      const all = resArray.reduce((acc, cur) => ({ ...acc, ...cur }), {});
      setArticles(all);
    });
  }, [boards]);

  const handleBoardChange = (id, value) => {
    setBoards((prev) => prev.map((b) => (b.id === id ? { ...b, name: value } : b)));
  };

  const handleArticleChange = (boardId, id, field, value) => {
    setArticles((prev) => ({
      ...prev,
      [boardId]: prev[boardId].map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    }));
  };

  const saveBoard = async (board) => {
    const res = await fetch(`/api/executive/board/update/${board.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: board.name }),
    });
    if (res.status === 204) alert('게시판 이름 수정 완료');
    else alert('게시판 이름 수정 실패: ' + res.status);
  };

  const deleteBoard = async (id) => {
    const ok = confirm('게시판을 삭제하시겠습니까?');
    if (!ok) return;
    const res = await fetch(`/api/executive/board/delete/${id}`, {
      method: "POST",
    });
    if (res.status === 204) {
      alert('삭제 완료');
      setBoards((prev) => prev.filter((b) => b.id !== id));
      setArticles((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      alert('삭제 실패: ' + res.status);
    }
  };

  const saveArticle = async (article) => {
    if (!article.title || !article.content || !article.board_id) {
      alert('제목, 내용, 게시판 ID는 필수입니다.');
      return;
    }
    const payload = {
      title: article.title.trim(),
      content: article.content.trim(),
      board_id: Number(article.board_id),
    };
    try {
      setSaving((s) => ({ ...s, [article.id]: true }));
      const res = await fetch(`/api/executive/article/update/${article.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 204) alert('✅ 게시글 수정 완료');
      else {
        const error = await res.text();
        alert('수정 실패: ' + (error || res.status));
      }
    } catch (err) {
      alert('요청 실패: ' + err.message);
    } finally {
      setSaving((s) => ({ ...s, [article.id]: false }));
    }
  };

  const deleteArticle = async (id, boardId) => {
    const ok = confirm('정말 삭제하시겠습니까?');
    if (!ok) return;
    const res = await fetch(`/api/executive/article/delete/${id}`, {
      method: "POST",
    });
    if (res.status === 204) {
      setArticles((prev) => ({
        ...prev,
        [boardId]: prev[boardId].filter((a) => a.id !== id),
      }));
    } else {
      alert('삭제 실패: ' + res.status);
    }
  };

  return (
    <div className="adm-section">
      {boards.map((board) => (
        <div key={board.id} className="adm-section">
          <h3>게시판 ID {board.id}</h3>

          <div className="adm-actions">
            <input
              className="adm-input"
              value={board.name}
              onChange={(e) => handleBoardChange(board.id, e.target.value)}
            />
            <button className="adm-button" onClick={() => saveBoard(board)}>
              이름 저장
            </button>
            <button className="adm-button outline" onClick={() => deleteBoard(board.id)}>
              게시판 삭제
            </button>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th className="adm-th" style={{ width: '10%' }}>
                    ID
                  </th>
                  <th className="adm-th" style={{ width: '30%' }}>
                    제목
                  </th>
                  <th className="adm-th" style={{ width: '45%' }}>
                    내용
                  </th>
                  <th className="adm-th" style={{ width: '15%' }}>
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {(articles[board.id] || []).map((article) => (
                  <tr key={article.id}>
                    <td className="adm-td">{article.id}</td>
                    <td className="adm-td">
                      <input
                        className="adm-input"
                        value={article.title}
                        onChange={(e) =>
                          handleArticleChange(board.id, article.id, 'title', e.target.value)
                        }
                      />
                    </td>
                    <td className="adm-td">
                      <input
                        className="adm-input"
                        value={article.content}
                        onChange={(e) =>
                          handleArticleChange(board.id, article.id, 'content', e.target.value)
                        }
                      />
                    </td>
                    <td className="adm-td">
                      <div className="adm-flex">
                        <button
                          className="adm-button"
                          onClick={() => saveArticle(article)}
                          disabled={saving[article.id]}
                        >
                          저장
                        </button>
                        <button
                          className="adm-button outline"
                          onClick={() => deleteArticle(article.id, board.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
