'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '../igpage.module.css';

async function fetchJson(path, init = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export default function ExecutiveTagManager() {
  const [tags, setTags] = useState([]);
  const [text, setText] = useState('');
  const [isMajor, setIsMajor] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadTags = async () => {
    try {
      const data = await fetchJson('/api/tags');
      setTags(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTags();

    const handleRefresh = () => {
      loadTags();
    };

    window.addEventListener('sig-tags:changed', handleRefresh);
    return () => window.removeEventListener('sig-tags:changed', handleRefresh);
  }, []);

  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => {
      const aText = (a?.text ?? '').toString();
      const bText = (b?.text ?? '').toString();
      return aText.localeCompare(bText, 'ko');
    });
  }, [tags]);

  const handleCreate = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    try {
      const created = await fetchJson('/api/executive/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed, is_major: isMajor }),
      });

      setTags((prev) => {
        const next = Array.isArray(prev) ? [...prev] : [];
        if (created?.id != null && next.some((tag) => String(tag?.id) === String(created.id))) {
          return next;
        }
        return [...next, created];
      });

      setText('');
      setIsMajor(false);
      window.dispatchEvent(new Event('sig-tags:changed'));
    } catch (e) {
      alert(`태그 생성 실패: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tagId) => {
    if (loading) return;

    setLoading(true);
    try {
      await fetchJson(`/api/executive/tag/${tagId}`, {
        method: 'DELETE',
      });

      setTags((prev) =>
        Array.isArray(prev) ? prev.filter((tag) => String(tag?.id) !== String(tagId)) : [],
      );
      window.dispatchEvent(new Event('sig-tags:changed'));
    } catch (e) {
      alert(`태그 삭제 실패: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['adm-section']}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          className={styles['adm-input']}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="새 태그 이름"
        />
        <label style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={isMajor}
            onChange={(e) => setIsMajor(e.target.checked)}
          />
          메이저 태그
        </label>
        <button className={styles['adm-button']} onClick={handleCreate} disabled={loading}>
          생성
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
        {sortedTags.map((tag) => (
          <button
            key={tag.id}
            className={styles['adm-button']}
            onClick={() => handleDelete(tag.id)}
            disabled={loading}
          >
            {(tag.text ?? '') + (tag.is_major ? ' [M]' : '')} ×
          </button>
        ))}
      </div>
    </div>
  );
}
