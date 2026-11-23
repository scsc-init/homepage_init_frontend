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
import Checkbox from '@/components/form-control/Checkbox';

const normalizeTagText = (text) =>
  String(text ?? '')
    .trim()
    .toLowerCase();

export function createIgTag({ text, is_major }, isExecutive) {
  return fetchBackendClient(isExecutive ? '/api/executive/tag' : '/api/tag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(isExecutive ? { text, is_major } : { text }),
  });
}

const SigTagManager = forwardRef(function SigTagManager(props, ref) {
  const t = useTranslations('Ig');
  const {
    sigId,
    initialTags,
    initialTagIds,
    selectedTagTexts,
    onSelectedTagTextsChange,
    pendingTags,
    onPendingTagsChange,
    lockedTagTexts,
    isExecutive = false,
    onChange,
    disabled = false,
    targetLabel = 'SIG',
    translate,
  } = props;
  const isCreate = Array.isArray(selectedTagTexts);

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
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [catalogError, setCatalogError] = useState('');
  const controlsDisabled = loading || disabled || (isCreate && !catalogLoaded);

  const sortTags = (tagList) =>
    [...tagList].sort((a, b) => {
      if (a.is_major !== b.is_major) return a.is_major ? -1 : 1;
      return String(a.text ?? '').localeCompare(String(b.text ?? ''), 'ko');
    });

  const refreshAllTags = useCallback(async () => {
    const res = await fetchBackendClient('/api/tags', { cache: 'no-store' });
    if (!res.ok) throw new Error(translate ? translate('tagsLoadFailed') : t('tags.loadError'));

    const data = await res.json();
    setAllTags(sortTags(Array.isArray(data) ? data : []));
    setCatalogLoaded(true);
    setCatalogError('');
  }, [translate, t]);

  useEffect(() => {
    refreshAllTags().catch(() => {
      setCatalogError(translate ? translate('tagsRefreshFailed') : t('tags.refreshError'));
    });
  }, [refreshAllTags, translate, t]);

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
  const pendingTagKeys = useMemo(
    () => new Set(pendingTags?.map((tag) => normalizeTagText(tag.text))),
    [pendingTags],
  );

  const attachedTags = useMemo(() => {
    if (isCreate) {
      return sortTags([
        ...selectedTagTexts.map(
          (text) =>
            allTags.find((tag) => tag.text === text) ?? { id: text, text, is_major: false },
        ),
        ...pendingTags.map((tag) => ({ ...tag, id: `pending:${tag.text}`, pending: true })),
      ]);
    }
    return sortTags(allTags.filter((tag) => attachedTagIdSet.has(String(tag.id))));
  }, [allTags, attachedTagIdSet, isCreate, pendingTags, selectedTagTexts]);

  const selectableTags = useMemo(() => {
    return sortTags(
      allTags.filter((tag) => {
        if (
          isCreate
            ? selectedTagTexts.includes(tag.text) ||
              pendingTagKeys.has(normalizeTagText(tag.text))
            : attachedTagIdSet.has(String(tag.id))
        ) {
          return false;
        }
        if (!isExecutive && tag.is_major) return false;
        return true;
      }),
    );
  }, [allTags, attachedTagIdSet, isCreate, isExecutive, pendingTagKeys, selectedTagTexts]);

  const addTag = (tag) => {
    if (isCreate) {
      if (!selectedTagTexts.includes(tag.text)) {
        onSelectedTagTextsChange([...selectedTagTexts, tag.text]);
      }
      return;
    }

    setAttachedTagIds((prev) => {
      const nextId = String(tag.id);
      if (prev.includes(nextId)) return prev;
      return [...prev, nextId];
    });
  };

  const addExistingTag = () => {
    if (controlsDisabled) return;

    const tag = selectableTags.find((tag) => String(tag.id) === selectedTagId);
    if (!tag) return;

    addTag(tag);
    setSelectedTagId('');
  };

  const createAndAddTag = async () => {
    const text = newTagText.trim();
    if (!text || controlsDisabled) return;

    const normalizedText = normalizeTagText(text);
    const existsInCatalog = allTags.some(
      (tag) => normalizeTagText(tag.text) === normalizedText,
    );
    if (existsInCatalog) {
      alert(translate ? translate('tagExists') : t('tags.duplicate'));
      return;
    }

    if (isCreate) {
      if (!pendingTagKeys.has(normalizedText)) {
        onPendingTagsChange([...pendingTags, { text, is_major: isExecutive && newTagIsMajor }]);
      }
      setNewTagText('');
      setNewTagIsMajor(false);
      return;
    }

    const createErrorMessage = translate ? translate('tagCreateFailed') : t('tags.createError');
    setLoading(true);

    try {
      const res = await createIgTag({ text, is_major: newTagIsMajor }, isExecutive);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const detail = err?.detail;
        let message = typeof detail === 'string' && detail ? detail : createErrorMessage;
        if (detail === '이미 존재하는 태그입니다') {
          message = translate ? translate('tagExists') : t('tags.duplicate');
        } else if (detail === '태그명은 비어 있을 수 없습니다') {
          message = t('tags.nameRequired');
        }
        alert(message);
        return;
      }

      const createdTag = await res.json();

      setAllTags((prev) => sortTags([...prev, createdTag]));
      addTag(createdTag);
      setNewTagText('');
      setNewTagIsMajor(false);
    } catch {
      alert(createErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isTagLocked = (tag) =>
    lockedTagTexts?.includes(tag.text) || (tag.is_major && !isExecutive);

  const removeTag = (tag) => {
    if (controlsDisabled || isTagLocked(tag)) return;

    if (isCreate) {
      if (tag.pending) {
        onPendingTagsChange(pendingTags.filter((entry) => entry.text !== tag.text));
      } else {
        onSelectedTagTextsChange(selectedTagTexts.filter((text) => text !== tag.text));
      }
      return;
    }

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
          throw new Error(
            err.detail ?? (translate ? translate('tagDeleteFailed') : t('tags.deleteError')),
          );
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
          throw new Error(
            err.detail ?? (translate ? translate('tagAddFailed') : t('tags.addError')),
          );
        }
      });

      await Promise.all([...deleteRequests, ...addRequests]);
      setOriginalAttachedTagIds(attachedTagIds);
    } finally {
      setLoading(false);
    }
  }, [sigId, originalAttachedTagIds, attachedTagIds, translate, t]);

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
        <h3 className={styles.SigTagManagerTitle}>
          {translate ? translate('tags') : t('tags.heading')}
        </h3>
        <p className={styles.SigTagManagerDescription}>
          {translate
            ? translate('tagsSaveHelp', { value0: targetLabel ?? '' })
            : t(isCreate ? 'tags.createSaveHint' : 'tags.saveHint', { kind: targetLabel })}
        </p>
        {catalogError ? <p className={styles.SigTagErrorText}>{catalogError}</p> : null}
      </div>

      <div className={styles.SigAttachedTagSection}>
        {attachedTags.length === 0 ? (
          <span className={styles.SigEmptyTagText}>
            {translate ? translate('noTags') : t('tags.empty')}
          </span>
        ) : (
          <div className={styles.SigAttachedTagList}>
            {attachedTags.map((tag) => {
              const locked = isTagLocked(tag);
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
                      disabled={controlsDisabled}
                      aria-label={
                        translate
                          ? translate('removeTagLabel', { value0: String(tag.text) })
                          : t('tags.removeLabel', { tag: tag.text })
                      }
                    >
                      {translate ? translate('delete') : t('tags.remove')}
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
          {translate ? translate('selectTag') : t('tags.select')}
        </label>
        <select
          id="sig-tag-select"
          className={styles.SigTagSelect}
          value={selectedTagId}
          onChange={(e) => setSelectedTagId(e.target.value)}
          disabled={controlsDisabled}
        >
          <option value="">{translate ? translate('selectTag') : t('tags.select')}</option>
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
          disabled={controlsDisabled || !selectedTagId}
        >
          {translate ? translate('addExistingTag') : t('tags.add')}
        </Button>
      </div>

      <div className={styles.SigTagControlGroup}>
        <label htmlFor="sig-tag-new-input" className={styles.SigTagFieldLabel}>
          {translate ? translate('newTagName') : t('tags.newName')}
        </label>
        <input
          id="sig-tag-new-input"
          className={styles.SigTagInput}
          value={newTagText}
          onChange={(e) => setNewTagText(e.target.value)}
          onKeyDown={
            isCreate
              ? (event) => {
                  if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    createAndAddTag();
                  }
                }
              : undefined
          }
          placeholder={translate ? translate('newTagName') : t('tags.newName')}
          disabled={controlsDisabled}
        />
        {isExecutive ? (
          <Checkbox
            className={styles.SigTagCheckboxLabel}
            checked={newTagIsMajor}
            onChange={(e) => setNewTagIsMajor(e.target.checked)}
            disabled={controlsDisabled}
          >
            {t('tags.major')}
          </Checkbox>
        ) : null}
        <Button
          variant="secondary"
          className={styles.SigTagActionButton}
          onClick={createAndAddTag}
          disabled={controlsDisabled || !newTagText.trim()}
        >
          {translate
            ? translate('createAndAddTag')
            : t(isCreate ? 'tags.addNew' : 'tags.create')}
        </Button>
      </div>
    </div>
  );
});

export default SigTagManager;
