'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SigTagManager.module.css';

export default function SigTagManager({
  initialTags = [],
  isExecutive = false,
  onChange,
  disabled = false,
}) {
  const [tags, setTags] = useState(Array.isArray(initialTags) ? initialTags : []);
  const [allTags, setAllTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState('');
  const [newTagText, setNewTagText] = useState('');
  const [newTagIsMajor, setNewTagIsMajor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [catalogError, setCatalogError] = useState('');
  const tempIdRef = useRef(0);

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
  };

  useEffect(() => {
    setTags(sortTags(Array.isArray(initialTags) ? initialTags : []));
  }, [initialTags]);

  useEffect(() => {
    refreshAllTags().catch(() => {
      setCatalogError('태그 목록을 새로 불러오지 못했습니다.');
    });
  }, []);

  useEffect(() => {
    onChange?.(sortTags(Array.isArray(tags) ? tags : []));
  }, [tags, onChange]);

  const attachedTagIds = useMemo(() => new Set(tags.map((tag) => String(tag.id))), [tags]);

  const selectableTags = useMemo(() => {
    return sortTags(
      allTags.filter((tag) => {
        if (attachedTagIds.has(String(tag.id))) return false;
        if (!isExecutive && tag.is_major) return false;
        return true;
      }),
    );
  }, [allTags, attachedTagIds, isExecutive]);

  const addExistingTag = () => {
    if (!selectedTagId || loading || disabled) return;

    const addedTag = allTags.find((tag) => String(tag.id) === String(selectedTagId));
    if (!addedTag) return;

    setTags((prev) => {
      if (prev.some((tag) => String(tag.id) === String(addedTag.id))) return prev;
      return sortTags([...prev, addedTag]);
    });
    setSelectedTagId('');
  };

  const createAndAddTag = () => {
    const text = newTagText.trim();
    if (!text || loading || disabled) return;

    const normalizedText = text.toLowerCase();
    const existsInAttached = tags.some(
      (tag) =>
        String(tag.text ?? '')
          .trim()
          .toLowerCase() === normalizedText,
    );
    if (existsInAttached) {
      alert('이미 추가된 태그입니다.');
      return;
    }

    const tempTag = {
      id: `temp-${Date.now()}-${tempIdRef.current++}`,
      text,
      is_major: isExecutive ? newTagIsMajor : false,
      __isNew: true,
    };

    setTags((prev) => sortTags([...prev, tempTag]));
    setNewTagText('');
    setNewTagIsMajor(false);
  };

  const removeTag = (tag) => {
    if (loading || disabled) return;
    if (tag.is_major && !isExecutive) return;

    setTags((prev) => sortTags(prev.filter((item) => String(item.id) !== String(tag.id))));
  };

  return (
    <div className={styles.SigTagManager}>
      <div className={styles.SigTagManagerHeader}>
        <h3 className={styles.SigTagManagerTitle}>태그</h3>
        <p className={styles.SigTagManagerDescription}>
          저장 전까지 태그 변경 사항이 임시로 쌓이며, 수정 버튼을 눌렀을 때 한 번에 반영됩니다.
        </p>
        {catalogError ? <p className={styles.SigTagErrorText}>{catalogError}</p> : null}
      </div>

      <div className={styles.SigAttachedTagSection}>
        {tags.length === 0 ? (
          <span className={styles.SigEmptyTagText}>등록된 태그 없음</span>
        ) : (
          <div className={styles.SigAttachedTagList}>
            {tags.map((tag) => {
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
