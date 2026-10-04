'use client';

import type { IgTag, SigTagManagerHandle } from '@/app/(ig)/components/editor/types';
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

type SigTagManagerProps = {
  sigId?: string | number | null;
  initialTags?: IgTag[] | null;
  initialTagIds?: Array<string | number> | null;
  isExecutive?: boolean;
  onChange?: (tagIds: number[]) => void;
  disabled?: boolean;
  targetLabel?: string;
};

type CatalogTag = {
  id: string | number;
  text: string;
  is_major: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeTag(value: unknown): CatalogTag | null {
  if (!isRecord(value)) return null;

  const id = value.id;
  if (typeof id !== 'string' && typeof id !== 'number') return null;

  return {
    id,
    text: typeof value.text === 'string' ? value.text : '',
    is_major: value.is_major === true,
  };
}

function normalizeTagList(value: unknown): CatalogTag[] {
  if (!Array.isArray(value)) return [];

  return value.map(normalizeTag).filter((tag): tag is CatalogTag => tag !== null);
}

function sortTags(tagList: CatalogTag[]): CatalogTag[] {
  return [...tagList].sort((first, second) => {
    if (first.is_major !== second.is_major) return first.is_major ? -1 : 1;
    return first.text.localeCompare(second.text, 'ko');
  });
}

async function readErrorDetail(response: Response, fallback: string): Promise<string> {
  const data: unknown = await response.json().catch(() => null);
  if (isRecord(data) && typeof data.detail === 'string') return data.detail;
  return fallback;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

const SigTagManager = forwardRef<SigTagManagerHandle, SigTagManagerProps>(
  function SigTagManager(
    {
      sigId,
      initialTags,
      initialTagIds,
      isExecutive = false,
      onChange,
      disabled = false,
      targetLabel = 'SIG',
    },
    ref,
  ) {
    const resolvedInitialIds = useMemo<string[]>(() => {
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

    const [allTags, setAllTags] = useState<CatalogTag[]>([]);
    const [attachedTagIds, setAttachedTagIds] = useState<string[]>(resolvedInitialIds);
    const [originalAttachedTagIds, setOriginalAttachedTagIds] =
      useState<string[]>(resolvedInitialIds);
    const [selectedTagId, setSelectedTagId] = useState<string>('');
    const [newTagText, setNewTagText] = useState<string>('');
    const [newTagIsMajor, setNewTagIsMajor] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [catalogError, setCatalogError] = useState<string>('');

    const refreshAllTags = useCallback(async (): Promise<void> => {
      const response = await fetchBackendClient('/api/tags', { cache: 'no-store' });
      if (!response.ok) throw new Error('태그 목록을 불러오지 못했습니다.');

      const data: unknown = await response.json();
      setAllTags(sortTags(normalizeTagList(data)));
      setCatalogError('');
    }, []);

    useEffect(() => {
      void refreshAllTags().catch(() => {
        setCatalogError('태그 목록을 새로 불러오지 못했습니다.');
      });
    }, [refreshAllTags]);

    useEffect(() => {
      setAttachedTagIds((previous) =>
        previous.join(',') === resolvedInitialIdsKey ? previous : resolvedInitialIds,
      );
      setOriginalAttachedTagIds((previous) =>
        previous.join(',') === resolvedInitialIdsKey ? previous : resolvedInitialIds,
      );
    }, [resolvedInitialIds, resolvedInitialIdsKey]);

    useEffect(() => {
      onChange?.(attachedTagIds.map((id) => Number(id)));
    }, [attachedTagIds, onChange]);

    const attachedTagIdSet = useMemo(() => new Set<string>(attachedTagIds), [attachedTagIds]);

    const attachedTags = useMemo(
      () => sortTags(allTags.filter((tag) => attachedTagIdSet.has(String(tag.id)))),
      [allTags, attachedTagIdSet],
    );

    const selectableTags = useMemo(
      () =>
        sortTags(
          allTags.filter((tag) => {
            if (attachedTagIdSet.has(String(tag.id))) return false;
            if (!isExecutive && tag.is_major) return false;
            return true;
          }),
        ),
      [allTags, attachedTagIdSet, isExecutive],
    );

    const addExistingTag = (): void => {
      if (!selectedTagId || loading || disabled) return;

      setAttachedTagIds((previous) => {
        const nextId = String(selectedTagId);
        return previous.includes(nextId) ? previous : [...previous, nextId];
      });
      setSelectedTagId('');
    };

    const createAndAddTag = async (): Promise<void> => {
      const text = newTagText.trim();
      if (!text || loading || disabled) return;

      const normalizedText = text.toLowerCase();
      const existsInCatalog = allTags.some(
        (tag) => tag.text.trim().toLowerCase() === normalizedText,
      );

      if (existsInCatalog) {
        window.alert('이미 존재하는 태그입니다. 기존 태그 선택에서 추가해주세요.');
        return;
      }

      setLoading(true);

      try {
        const response = await fetchBackendClient(
          isExecutive ? '/api/executive/tag' : '/api/tag',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(isExecutive ? { text, is_major: newTagIsMajor } : { text }),
          },
        );

        if (!response.ok) {
          throw new Error(await readErrorDetail(response, '새 태그 생성 실패'));
        }

        const createdTag = normalizeTag((await response.json()) as unknown);
        if (!createdTag) throw new Error('새 태그 응답 형식이 올바르지 않습니다.');

        setAllTags((previous) => sortTags([...previous, createdTag]));
        setAttachedTagIds((previous) => {
          const nextId = String(createdTag.id);
          return previous.includes(nextId) ? previous : [...previous, nextId];
        });
        setNewTagText('');
        setNewTagIsMajor(false);
      } catch (error) {
        window.alert(getErrorMessage(error, '새 태그 생성 실패'));
      } finally {
        setLoading(false);
      }
    };

    const removeTag = (tag: CatalogTag): void => {
      if (loading || disabled) return;
      if (tag.is_major && !isExecutive) return;

      setAttachedTagIds((previous) => previous.filter((id) => id !== String(tag.id)));
    };

    const syncTags = useCallback(async (): Promise<void> => {
      if (!sigId) return;

      const originalIdSet = new Set<string>(originalAttachedTagIds);
      const currentIdSet = new Set<string>(attachedTagIds);

      const removedTagIds = originalAttachedTagIds.filter((id) => !currentIdSet.has(id));
      const addedTagIds = attachedTagIds.filter((id) => !originalIdSet.has(id));

      if (removedTagIds.length === 0 && addedTagIds.length === 0) return;

      setLoading(true);

      try {
        const deleteRequests = removedTagIds.map(async (tagId): Promise<void> => {
          const response = await fetchBackendClient(`/api/sig/${sigId}/tag/${tagId}`, {
            method: 'DELETE',
          });

          if (!response.ok && response.status !== 204) {
            throw new Error(await readErrorDetail(response, '태그 삭제 실패'));
          }
        });

        const addRequests = addedTagIds.map(async (tagId): Promise<void> => {
          const response = await fetchBackendClient(`/api/sig/${sigId}/tag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag_id: Number(tagId) }),
          });

          if (!response.ok) {
            throw new Error(await readErrorDetail(response, '태그 추가 실패'));
          }
        });

        await Promise.all([...deleteRequests, ...addRequests]);
        setOriginalAttachedTagIds([...attachedTagIds]);
      } finally {
        setLoading(false);
      }
    }, [attachedTagIds, originalAttachedTagIds, sigId]);

    useImperativeHandle(ref, () => ({ syncTags }), [syncTags]);

    return (
      <div className={styles.SigTagManager}>
        <div className={styles.SigTagManagerHeader}>
          <h3 className={styles.SigTagManagerTitle}>태그</h3>
          <p className={styles.SigTagManagerDescription}>
            수정 후 반드시 {targetLabel} 수정 버튼을 눌러주세요.
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
            onChange={(event) => setSelectedTagId(event.target.value)}
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
            onChange={(event) => setNewTagText(event.target.value)}
            placeholder="새 태그명"
            disabled={loading || disabled}
          />
          {isExecutive ? (
            <label className={styles.SigTagCheckboxLabel}>
              <input
                type="checkbox"
                checked={newTagIsMajor}
                onChange={(event) => setNewTagIsMajor(event.target.checked)}
                disabled={loading || disabled}
              />
              <span>major</span>
            </label>
          ) : null}
          <button
            type="button"
            className={styles.SigTagActionButton}
            onClick={() => {
              void createAndAddTag();
            }}
            disabled={loading || disabled || !newTagText.trim()}
          >
            새 태그 생성 후 추가
          </button>
        </div>
      </div>
    );
  },
);

export default SigTagManager;
