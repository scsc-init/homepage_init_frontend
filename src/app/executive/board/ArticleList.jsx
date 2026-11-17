'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import React, { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import styles from './ArticleList.module.css';
const BOARD_TYPE_OPTIONS = ['TEXT', 'NONE', 'IMAGE', 'FILE'];

export default function ArticleList({ boards: boardsDefault }) {
  const t = useTranslations('Executive');
  const [boards, setBoards] = useState(boardsDefault ?? []);
  const [articles, setArticles] = useState({});
  const [saving, setSaving] = useState({});

  useEffect(() => {
    async function fetchBoardArticles(boardId) {
      const res = await fetchBackendClient(`/api/articles/${boardId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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

  const handleBoardChange = (id, field, value) => {
    setBoards((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const handleArticleChange = (boardId, id, field, value) => {
    setArticles((prev) => ({
      ...prev,
      [boardId]: prev[boardId].map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    }));
  };

  const saveBoard = async (board) => {
    try {
      const res = await fetchBackendClient(`/api/executive/board/update/${board.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: board.name,
          board_type: board.board_type ?? 'TEXT',
        }),
      });
      if (res.status === 204) alert(t('boardRenamed'));
      else alert(t('boardRenameFailedPrefix') + res.status);
    } catch (err) {
      alert(
        t('boardRenameFailed', {
          value0: String(err instanceof Error ? err.message : t('networkError')),
        }),
      );
    }
  };
  const deleteBoard = async (id) => {
    const ok = confirm(t('confirmDeleteBoard'));
    if (!ok) return;
    try {
      const res = await fetchBackendClient(`/api/executive/board/delete/${id}`, {
        method: 'POST',
      });
      if (res.status === 204) {
        alert(t('deleted'));
        setBoards((prev) => prev.filter((b) => b.id !== id));
        setArticles((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      } else {
        alert(t('deleteFailedPrefix') + res.status);
      }
    } catch (err) {
      alert(
        t('deleteFailedDetail', {
          value0: String(err instanceof Error ? err.message : t('networkError')),
        }),
      );
    }
  };

  const saveArticle = async (article) => {
    const title = article.title.trim();
    const content = article.content?.trim() ?? '';

    if (!title || !content || !article.board_id) {
      alert(t('postRequiredFields'));
      return;
    }
    const payload = {
      title,
      content,
      board_id: Number(article.board_id),
    };
    try {
      setSaving((s) => ({ ...s, [article.id]: true }));
      const res = await fetchBackendClient(`/api/executive/article/update/${article.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 204) alert(t('postUpdated'));
      else {
        const error = await res.text();
        alert(t('editFailedPrefix') + (error || res.status));
      }
    } catch (err) {
      alert(t('requestFailedPrefix') + err.message);
    } finally {
      setSaving((s) => ({ ...s, [article.id]: false }));
    }
  };

  const deleteArticle = async (id, boardId) => {
    const ok = confirm(t('confirmDelete'));
    if (!ok) return;
    try {
      const res = await fetchBackendClient(`/api/executive/article/delete/${id}`, {
        method: 'POST',
      });
      if (res.status === 204) {
        setArticles((prev) => ({
          ...prev,
          [boardId]: prev[boardId].filter((a) => a.id !== id),
        }));
      } else {
        alert(t('deleteFailedPrefix') + res.status);
      }
    } catch (err) {
      alert(
        t('deleteFailedDetail', {
          value0: String(err instanceof Error ? err.message : t('networkError')),
        }),
      );
    }
  };

  return (
    <div className={styles.articleSection}>
      {boards.map((board) => (
        <div key={board.id} className={styles.articleSection}>
          <h3 className={styles.articleSection}>{t('boardId', { value0: board.id ?? '' })}</h3>

          <div className={styles.actions}>
            <input
              className={styles.input}
              value={board.name}
              onChange={(e) => handleBoardChange(board.id, 'name', e.target.value)}
            />
            <select
              className={styles.input}
              value={board.board_type ?? 'TEXT'}
              onChange={(e) => handleBoardChange(board.id, 'board_type', e.target.value)}
            >
              {BOARD_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Button className={styles.button} onClick={() => saveBoard(board)}>
              {t('saveName')}
            </Button>
            <Button
              variant="secondary"
              className={styles.button}
              onClick={() => deleteBoard(board.id)}
            >
              {t('deleteBoard')}
            </Button>
          </div>

          <div className={styles.wrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>ID</th>
                  <th style={{ width: '30%' }}>{t('title')}</th>
                  <th style={{ width: '45%' }}>{t('content')}</th>
                  <th style={{ width: '15%' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {(articles[board.id] || []).map((article) => (
                  <tr key={article.id}>
                    <td>{article.id}</td>
                    <td>
                      <input
                        className={styles.input}
                        value={article.title}
                        onChange={(e) =>
                          handleArticleChange(board.id, article.id, 'title', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {article.content === null ? (
                        <span>{t('postLoadFailed')}</span>
                      ) : (
                        <input
                          className={styles.input}
                          value={article.content}
                          onChange={(e) =>
                            handleArticleChange(board.id, article.id, 'content', e.target.value)
                          }
                        />
                      )}
                    </td>
                    <td>
                      <div>
                        <Button
                          className={styles.button}
                          onClick={() => saveArticle(article)}
                          disabled={saving[article.id]}
                        >
                          {t('save')}
                        </Button>
                        <Button
                          variant="secondary"
                          className={styles.button}
                          onClick={() => deleteArticle(article.id, board.id)}
                        >
                          {t('delete')}
                        </Button>
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
