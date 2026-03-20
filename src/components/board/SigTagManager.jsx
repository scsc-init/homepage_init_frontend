'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './SigTagManager.module.css';

export default function SigTagManager({
  initialTags = [],
  initialTagIds = [],
  isExecutive = false,
  onChange,
  disabled = false,
}) {
  const [allTags, setAllTags] = useState([]);
  const [attachedTagIds, setAttachedTagIds] = useState(
    Array.isArray(initialTagIds)
      ? initialTagIds.map((id) => String(id))
      : Array.isArray(initialTags)
        ? initialTags.map((tag) => String(tag.id))
        : [],
  );
  const [selectedTagId, setSelectedTagId] = useState('');
  const [newTagText, setNewTagText] = useState('');
  const [newTagIsMajor, setNewTagIsMajor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [catalogError, setCatalogError] = useState('');

  const sortTags = (tagList) =>
    [...tagList].sort((a, b) => {
      if (a.is_major !== b.is_major) return a.is_major ? -1 : 1;
      return String(a.text ?? '').localeCompare(String(b.text ?? ''), 'ko');
    });

  const refreshAllTags = async () => {
    const res = await fetch('/api/tags', { cache: 'no-store' });
    if (!res.ok) throw new Error('태그 목록을 불러오지 못했습니다.');

    const data = await res.json();
    setAllTags(sortTags(Array.isArray(data) ? data : []));
    setCatalogError('');
    return Array.isArray(data) ? data : [];
  };

  useEffect(() => {
    setAttachedTagIds(
      Array.isArray(initialTagIds)
        ? initialTagIds.map((id) => String(id))
        : Array.isArray(initialTags)
          ? initialTags.map((tag) => String(tag.id))
          : [],
    );
  }, [initialTagIds, initialTags]);

  useEffect(() => {
    refreshAllTags().catch(() => {
      setCatalogError('태그 목록을 새로 불러오지 못했습니다.');
    });
  }, []);

  useEffect(() => {
    onChange?.(attachedTagIds.map((id) => Number(id)));
  }, [attachedTagIds, onChange]);

  const attachedTagIdSet = useMemo(() => new Set(attachedTagIds), [attachedTagIds]);

  const attachedTags = useMemo(() => {
    return sortTags(allTags.filter((tag) => attachedTagIdSet.has(String(tag.id))));
  }, [allTags, attachedTagIdSet]);

  const selectableTags = useMemo(() => {
    return sortTags(
      allTags.filter((tag) => {
        if (attachedTagIdSet.has(String(tag.id))) return false;
        if (!isExecutive && tag.is_major) return false;
        return true;
      }),
    );
  }, [allTags, attachedTagIdSet, isExecutive]);

  const addExistingTag = () => {
    if (!selectedTagId || loading || disabled) return;

    setAttachedTagIds((prev) => {
      if (prev.includes(String(selectedTagId))) return prev;
      return [...prev, String(selectedTagId)];
    });
    setSelectedTagId('');
  };

  const createAndAddTag = async () => {
    const text = newTagText.trim();
    if (!text || loading || disabled) return;

    const normalizedText = text.toLowerCase();
    const existsInCatalog = allTags.some(
      (tag) =>
        String(tag.text ?? '')
          .trim()
          .toLowerCase() === normalizedText,
    );
    if (existsInCatalog) {
      alert('이미 존재하는 태그입니다. 기존 태그 선택에서 추가해주세요.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(isExecutive ? '/api/executive/tag' : '/api/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isExecutive ? { text, is_major: Boolean(newTagIsMajor) } : { text },
        ),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? '새 태그 생성 실패');
      }

      const createdTag = await res.json();

      setAllTags((prev) => sortTags([...prev, createdTag]));
      setAttachedTagIds((prev) => {
        const nextId = String(createdTag.id);
        if (prev.includes(nextId)) return prev;
        return [...prev, nextId];
      });
      setNewTagText('');
      setNewTagIsMajor(false);
    } catch (err) {
      alert(err.message || '새 태그 생성 실패');
    } finally {
      setLoading(false);
    }
  };

  const removeTag = (tag) => {
    if (loading || disabled) return;
    if (tag.is_major && !isExecutive) return;

    setAttachedTagIds((prev) => prev.filter((id) => id !== String(tag.id)));
  };

  return (
    <div className={styles.SigTagManager}>
      <div className={styles.SigTagManagerHeader}>
        <h3 className={styles.SigTagManagerTitle}>태그</h3>
        <p className={styles.SigTagManagerDescription}>
          저장 전까지 시그에 반영할 태그 변경 사항이 임시로 쌓이며, 수정 버튼을 눌렀을 때 한
          번에 반영됩니다.
        </p>
        {catalogError ? <p className={styles.SigTagErrorText}>{catalogError}</p> : null}
      </div>

      <div className={styles.SigAttachedTagSection}>
        {attachedTags.length === 0 ? (
          <span className={styles.SigEmptyTagText}>등록된 태그 없음</span>
        ) : (
          <div className={styles.SigAttachedTagList}>
            {attachedTags.map((tag) => {
              const locked = tag.is_major && !isExecutive;
              return (
                <div
                  key={tag.id}
                  className={`${styles.SigAttachedTagItem} ${tag.is_major ? styles.major : ''} ${locked ? styles.locked : ''}`}
                >
                  <span className={styles.SigAttachedTagText}>#{tag.text}</span>
                  {!locked ? (
                    <button
                      type="button"
                      className={styles.SigAttachedTagRemove}
                      onClick={() => removeTag(tag)}
                      disabled={loading || disabled}
                      aria-label={`${tag.text} 태그 삭제`}
                    >
                      삭제
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.SigTagControlGroup}>
        <label htmlFor="sig-tag-select" className={styles.SigTagFieldLabel}>
          기존 태그 선택
        </label>
        <select
          id="sig-tag-select"
          className={styles.SigTagSelect}
          value={selectedTagId}
          onChange={(e) => setSelectedTagId(e.target.value)}
          disabled={loading || disabled}
        >
          <option value="">기존 태그 선택</option>
          {selectableTags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.text}
              {tag.is_major ? ' (major)' : ''}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={styles.SigTagActionButton}
          onClick={addExistingTag}
          disabled={loading || disabled || !selectedTagId}
        >
          기존 태그 추가
        </button>
      </div>

      <div className={styles.SigTagControlGroup}>
        <label htmlFor="sig-tag-new-input" className={styles.SigTagFieldLabel}>
          새 태그명
        </label>
        <input
          id="sig-tag-new-input"
          className={styles.SigTagInput}
          value={newTagText}
          onChange={(e) => setNewTagText(e.target.value)}
          placeholder="새 태그명"
          disabled={loading || disabled}
        />
        {isExecutive ? (
          <label className={styles.SigTagCheckboxLabel}>
            <input
              type="checkbox"
              checked={newTagIsMajor}
              onChange={(e) => setNewTagIsMajor(e.target.checked)}
              disabled={loading || disabled}
            />
            <span>major</span>
          </label>
        ) : null}
        <button
          type="button"
          className={styles.SigTagActionButton}
          onClick={createAndAddTag}
          disabled={loading || disabled || !newTagText.trim()}
        >
          새 태그 생성 후 추가
        </button>
      </div>
    </div>
  );
}
