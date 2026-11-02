'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import styles from './SigTagManager.module.css';
import Button from '@/components/common/Button';

const SigTagManager = forwardRef(function SigTagManager(props, ref) {
  const t = useTranslations('Ig');
  const {
    sigId,
    initialTags,
    initialTagIds,
    isExecutive = false,
    onChange,
    disabled = false,
    targetLabel = 'SIG',
  } = props;

  const resolvedInitialIds = useMemo(() => {
    if (Array.isArray(initialTagIds)) {
      return initialTagIds.map((id) => String(id));
    }
    if (Array.isArray(initialTags)) {
      return initialTags.map((tag) => String(tag.id));
    }
    return [];
  }, [initialTagIds, initialTags]);

  const resolvedInitialIdsKey = useMemo(
    () => resolvedInitialIds.join(','),
    [resolvedInitialIds],
  );

  const [allTags, setAllTags] = useState([]);
  const [attachedTagIds, setAttachedTagIds] = useState(resolvedInitialIds);
  const [originalAttachedTagIds, setOriginalAttachedTagIds] = useState(resolvedInitialIds);
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

  const refreshAllTags = useCallback(async () => {
    const res = await fetchBackendClient('/api/tags', { cache: 'no-store' });
    if (!res.ok) throw new Error(t('tags.loadError'));

    const data = await res.json();
    setAllTags(sortTags(Array.isArray(data) ? data : []));
    setCatalogError('');
  }, [t]);

  useEffect(() => {
    refreshAllTags().catch(() => {
      setCatalogError(t('tags.refreshError'));
    });
  }, [refreshAllTags, t]);

  useEffect(() => {
    setAttachedTagIds((prev) => {
      const prevKey = prev.join(',');
      if (prevKey === resolvedInitialIdsKey) return prev;
      return resolvedInitialIds;
    });
    setOriginalAttachedTagIds((prev) => {
      const prevKey = prev.join(',');
      if (prevKey === resolvedInitialIdsKey) return prev;
      return resolvedInitialIds;
    });
  }, [resolvedInitialIds, resolvedInitialIdsKey]);

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
      const nextId = String(selectedTagId);
      if (prev.includes(nextId)) return prev;
      return [...prev, nextId];
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
      alert(t('tags.duplicate'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetchBackendClient(isExecutive ? '/api/executive/tag' : '/api/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isExecutive ? { text, is_major: Boolean(newTagIsMajor) } : { text },
        ),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? t('tags.createError'));
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
      alert(err.message || t('tags.createError'));
    } finally {
      setLoading(false);
    }
  };

  const removeTag = (tag) => {
    if (loading || disabled) return;
    if (tag.is_major && !isExecutive) return;

    setAttachedTagIds((prev) => prev.filter((id) => id !== String(tag.id)));
  };

  const syncTags = useCallback(async () => {
    if (!sigId) return;

    const originalIdSet = new Set(originalAttachedTagIds);
    const currentIdSet = new Set(attachedTagIds);

    const removedTagIds = originalAttachedTagIds.filter((id) => !currentIdSet.has(id));
    const addedTagIds = attachedTagIds.filter((id) => !originalIdSet.has(id));

    if (removedTagIds.length === 0 && addedTagIds.length === 0) return;

    setLoading(true);

    try {
      const deleteRequests = removedTagIds.map(async (tagId) => {
        const res = await fetchBackendClient(`/api/sig/${sigId}/tag/${tagId}`, {
          method: 'DELETE',
        });

        if (!res.ok && res.status !== 204) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail ?? t('tags.deleteError'));
        }
      });

      const addRequests = addedTagIds.map(async (tagId) => {
        const res = await fetchBackendClient(`/api/sig/${sigId}/tag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tag_id: Number(tagId) }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail ?? t('tags.addError'));
        }
      });

      await Promise.all([...deleteRequests, ...addRequests]);
      setOriginalAttachedTagIds(attachedTagIds);
    } finally {
      setLoading(false);
    }
  }, [sigId, originalAttachedTagIds, attachedTagIds, t]);

  useImperativeHandle(
    ref,
    () => ({
      syncTags,
    }),
    [syncTags],
  );

  return (
    <div className={styles.SigTagManager}>
      <div className={styles.SigTagManagerHeader}>
        <h3 className={styles.SigTagManagerTitle}>{t('tags.heading')}</h3>
        <p className={styles.SigTagManagerDescription}>
          {t('tags.saveHint', { kind: targetLabel })}
        </p>
        {catalogError ? <p className={styles.SigTagErrorText}>{catalogError}</p> : null}
      </div>

      <div className={styles.SigAttachedTagSection}>
        {attachedTags.length === 0 ? (
          <span className={styles.SigEmptyTagText}>{t('tags.empty')}</span>
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
                      aria-label={t('tags.removeLabel', { tag: tag.text })}
                    >
                      {t('tags.remove')}
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
          {t('tags.select')}
        </label>
        <select
          id="sig-tag-select"
          className={styles.SigTagSelect}
          value={selectedTagId}
          onChange={(e) => setSelectedTagId(e.target.value)}
          disabled={loading || disabled}
        >
          <option value="">{t('tags.select')}</option>
          {selectableTags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.text}
              {tag.is_major ? t('tags.majorSuffix') : ''}
            </option>
          ))}
        </select>
        <Button
          variant="secondary"
          className={styles.SigTagActionButton}
          onClick={addExistingTag}
          disabled={loading || disabled || !selectedTagId}
        >
          {t('tags.add')}
        </Button>
      </div>

      <div className={styles.SigTagControlGroup}>
        <label htmlFor="sig-tag-new-input" className={styles.SigTagFieldLabel}>
          {t('tags.newName')}
        </label>
        <input
          id="sig-tag-new-input"
          className={styles.SigTagInput}
          value={newTagText}
          onChange={(e) => setNewTagText(e.target.value)}
          placeholder={t('tags.newName')}
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
            <span>{t('tags.major')}</span>
          </label>
        ) : null}
        <Button
          variant="secondary"
          className={styles.SigTagActionButton}
          onClick={createAndAddTag}
          disabled={loading || disabled || !newTagText.trim()}
        >
          {t('tags.create')}
        </Button>
      </div>
    </div>
  );
});

export default SigTagManager;
