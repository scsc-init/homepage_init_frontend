'use client';

import { useEffect, useMemo, useState } from 'react';

export default function SigTagManager({ sigId, initialTags = [], isExecutive = false }) {
  const [tags, setTags] = useState(Array.isArray(initialTags) ? initialTags : []);
  const [allTags, setAllTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState('');
  const [newTagText, setNewTagText] = useState('');
  const [newTagIsMajor, setNewTagIsMajor] = useState(false);
  const [loading, setLoading] = useState(false);

  const sortTags = (tagList) =>
    [...tagList].sort((a, b) => {
      if (a.is_major !== b.is_major) return a.is_major ? -1 : 1;
      return a.text.localeCompare(b.text);
    });

  const refreshAllTags = async () => {
    const res = await fetch('/api/tags', { cache: 'no-store' });
    if (!res.ok) throw new Error('태그 목록을 불러오지 못했습니다.');
    const data = await res.json();
    setAllTags(sortTags(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    setTags(sortTags(Array.isArray(initialTags) ? initialTags : []));
  }, [initialTags]);

  useEffect(() => {
    refreshAllTags().catch(() => {});
  }, []);

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

  const addExistingTag = async () => {
    if (!selectedTagId || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/sig/${sigId}/tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_id: Number(selectedTagId) }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.detail ?? '태그 추가 실패');
        return;
      }

      const addedTag = allTags.find((tag) => String(tag.id) === String(selectedTagId));
      if (addedTag) {
        setTags((prev) => sortTags([...prev, addedTag]));
      }
      setSelectedTagId('');
    } catch {
      alert('태그 추가 실패: 네트워크 오류');
    } finally {
      setLoading(false);
    }
  };

  const createAndAddTag = async () => {
    const text = newTagText.trim();
    if (!text || loading) return;

    setLoading(true);
    try {
      const createRes = await fetch(isExecutive ? '/api/executive/tag' : '/api/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isExecutive ? { text, is_major: newTagIsMajor } : { text }),
      });

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        alert(err.detail ?? '태그 생성 실패');
        return;
      }

      const createdTag = await createRes.json();

      const addRes = await fetch(`/api/sig/${sigId}/tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_id: createdTag.id }),
      });

      if (!addRes.ok) {
        const err = await addRes.json().catch(() => ({}));
        alert(err.detail ?? '태그 생성 후 추가 실패');
        await refreshAllTags().catch(() => {});
        return;
      }

      setTags((prev) => sortTags([...prev, createdTag]));
      setAllTags((prev) => {
        if (prev.some((tag) => String(tag.id) === String(createdTag.id))) return prev;
        return sortTags([...prev, createdTag]);
      });
      setNewTagText('');
      setNewTagIsMajor(false);
    } catch {
      alert('태그 생성 실패: 네트워크 오류');
    } finally {
      setLoading(false);
    }
  };

  const removeTag = async (tag) => {
    if (loading) return;
    if (tag.is_major && !isExecutive) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/sig/${sigId}/tag/${tag.id}`, {
        method: 'DELETE',
      });

      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        alert(err.detail ?? '태그 삭제 실패');
        return;
      }

      setTags((prev) => sortTags(prev.filter((item) => String(item.id) !== String(tag.id))));
      await refreshAllTags().catch(() => {});
    } catch {
      alert('태그 삭제 실패: 네트워크 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="SigTagManager">
      <div className="SigTagManagerHeader">
        <h3 className="SigTagManagerTitle">태그</h3>
        <p className="SigTagManagerDescription">
          붙은 태그의 <strong>삭제</strong> 표시를 누르면 태그가 제거됩니다.
        </p>
      </div>

      <div className="SigAttachedTagSection">
        {tags.length === 0 ? (
          <span className="SigEmptyTagText">등록된 태그 없음</span>
        ) : (
          <div className="SigAttachedTagList">
            {tags.map((tag) => {
              const locked = tag.is_major && !isExecutive;
              return (
                <div
                  key={tag.id}
                  className={`SigAttachedTagItem ${tag.is_major ? 'major' : ''} ${
                    locked ? 'locked' : ''
                  }`}
                >
                  <span className="SigAttachedTagText">#{tag.text}</span>
                  {!locked ? (
                    <button
                      type="button"
                      className="SigAttachedTagRemove"
                      onClick={() => removeTag(tag)}
                      disabled={loading}
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

      <div className="SigTagControlGroup">
        <select
          className="SigTagSelect"
          value={selectedTagId}
          onChange={(e) => setSelectedTagId(e.target.value)}
          disabled={loading}
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
          className="SigTagActionButton"
          onClick={addExistingTag}
          disabled={loading || !selectedTagId}
        >
          기존 태그 추가
        </button>
      </div>

      <div className="SigTagControlGroup">
        <input
          className="SigTagInput"
          value={newTagText}
          onChange={(e) => setNewTagText(e.target.value)}
          placeholder="새 태그명"
          disabled={loading}
        />
        {isExecutive ? (
          <label className="SigTagCheckboxLabel">
            <input
              type="checkbox"
              checked={newTagIsMajor}
              onChange={(e) => setNewTagIsMajor(e.target.checked)}
              disabled={loading}
            />
            <span>major</span>
          </label>
        ) : null}
        <button
          type="button"
          className="SigTagActionButton"
          onClick={createAndAddTag}
          disabled={loading || !newTagText.trim()}
        >
          새 태그 생성 후 추가
        </button>
      </div>
    </div>
  );
}
