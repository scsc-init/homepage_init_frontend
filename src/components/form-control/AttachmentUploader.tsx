'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { useCallback, useMemo, useState, useEffect, type ChangeEvent } from 'react';
import { getAttachmentDownloadUrl, isImageAttachment } from '@/util/getAttachmentDownloadUrl';
import type { AttachmentMeta } from '@/util/getAttachmentDownloadUrl';
import { uploadCompressedImage } from '@/util/fetch/imageUpload';
import styles from './Attachment.module.css';
import { useTranslations } from 'next-intl';

type AttachmentItem = AttachmentMeta & {
  id?: string | number;
  file_id?: string | number;
  size?: number;
};

type AttachmentUploaderProps = {
  valueIds?: Array<string | number | AttachmentItem>;
  onChangeIds?: (ids: string[]) => void;
  label?: string;
  isImageUpload?: boolean;
  isFileUpload?: boolean;
};

function isAttachmentItem(value: unknown): value is AttachmentItem {
  return typeof value === 'object' && value !== null;
}

function getAttachmentId(item: string | number | AttachmentItem): string {
  return isAttachmentItem(item) ? String(item.file_id || item.id || '') : String(item);
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') return fallback;
  const { detail, message } = data as Record<string, unknown>;
  return typeof detail === 'string' ? detail : typeof message === 'string' ? message : fallback;
}

export default function AttachmentUploader({
  valueIds,
  onChangeIds,
  label,
  isImageUpload,
  isFileUpload,
}: AttachmentUploaderProps) {
  const t = useTranslations('AttachmentUploader');
  const [isUploading, setIsUploading] = useState(false);
  const [metadataMap, setMetadataMap] = useState<Record<string, AttachmentItem>>({});

  const ids = useMemo(() => {
    if (!Array.isArray(valueIds)) return [];
    return valueIds.map((item) => {
      return getAttachmentId(item);
    });
  }, [valueIds]);

  const registerMetadata = useCallback((items: AttachmentItem[]) => {
    if (!Array.isArray(items) || items.length === 0) return;
    setMetadataMap((prev) => {
      const next = { ...prev };
      items.forEach((item) => {
        const key = getAttachmentId(item);
        if (key) {
          next[key] = item;
        }
      });
      return next;
    });
  }, []);

  const missingIds = useMemo(
    () => ids.filter((id) => id && !metadataMap[id]),
    [ids, metadataMap],
  );

  useEffect(() => {
    if (missingIds.length === 0) return;
    let cancelled = false;

    const fetchMetadata = async () => {
      try {
        const params = new URLSearchParams();
        missingIds.forEach((id) => params.append('ids', id));
        const query = params.toString();
        const res = await fetchBackendClient(
          query ? `/api/file/metadata?${query}` : '/api/file/metadata',
        );
        const data: unknown = await res.json().catch(() => []);
        if (!res.ok) {
          throw new Error('failed to load metadata');
        }
        if (!cancelled) {
          registerMetadata(Array.isArray(data) ? data.filter(isAttachmentItem) : []);
        }
      } catch (err) {
        console.warn('첨부파일 정보를 불러오지 못했습니다.', err);
      }
    };

    fetchMetadata();
    return () => {
      cancelled = true;
    };
  }, [missingIds, registerMetadata]);

  const onPickFiles = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const pickedFiles = Array.from(e.target.files || []);
      e.target.value = ''; // same file re-pick 가능하게

      if (pickedFiles.length === 0) return;
      if (isUploading) return;

      const invalidFiles = isImageUpload
        ? pickedFiles.filter((file) => !file.type.startsWith('image/'))
        : pickedFiles.filter((file) => {
            const name = String(file.name || '').toLowerCase();
            return !(name.endsWith('.pdf') || name.endsWith('.docx') || name.endsWith('.pptx'));
          });
      if (invalidFiles.length > 0) {
        alert(isImageUpload ? t('imageOnly') : t('unsupportedType'));
      }

      const files = isImageUpload
        ? pickedFiles.filter((file) => file.type.startsWith('image/'))
        : pickedFiles.filter((file) => {
            const name = String(file.name || '').toLowerCase();
            return name.endsWith('.pdf') || name.endsWith('.docx') || name.endsWith('.pptx');
          });
      if (files.length === 0) return;

      setIsUploading(true);

      const uploadedItems: AttachmentItem[] = [];
      try {
        for (const file of files) {
          if (isImageUpload) {
            const uploaded = await uploadCompressedImage(file);
            if (!uploaded?.id) continue;

            uploadedItems.push({
              id: String(uploaded.id),
              original_filename: uploaded.original_filename || file.name,
              mime_type: file.type,
            });
            continue;
          }
          const formData = new FormData();
          formData.append('file', file);

          let res: Response;
          try {
            res = await fetchBackendClient(
              `/api/file/${isImageUpload ? 'image' : 'docs'}/upload`,
              {
                method: 'POST',
                body: formData,
              },
            );
          } catch {
            alert(t('networkError'));
            continue;
          }
          let data: unknown = null;
          try {
            data = await res.json();
          } catch {
            data = null;
          }

          if (!res.ok) {
            if (res.status === 401) {
              alert(t('loginRequired'));
              continue;
            }
            const msg = getErrorMessage(data, t('uploadFailed', { status: res.status }));
            alert(msg);
            continue;
          }

          if (!isAttachmentItem(data) || !data.id) {
            alert(t('missingId'));
            continue;
          }

          uploadedItems.push({
            id: String(data.id),
            original_filename:
              typeof data.original_filename === 'string' ? data.original_filename : file.name,
            size: typeof data.size === 'number' ? data.size : undefined,
            mime_type: typeof data.mime_type === 'string' ? data.mime_type : undefined,
          });
        }
      } finally {
        setIsUploading(false);
      }

      if (uploadedItems.length > 0) {
        const newUploadIds = uploadedItems.map(getAttachmentId);
        const merged = Array.from(new Set([...ids, ...newUploadIds]));

        onChangeIds?.(merged);
        registerMetadata(uploadedItems);
      }
    },
    [ids, isUploading, onChangeIds, registerMetadata, isImageUpload, t],
  );

  const removeId = useCallback(
    (id: string) => {
      const next = ids.filter((x) => x !== id);
      onChangeIds?.(next);
    },
    [ids, onChangeIds],
  );

  if (Boolean(isImageUpload) === Boolean(isFileUpload)) {
    console.error('AttachmentUploader: isImageUpload and isFileUpload must differ');
    return null;
  }

  return (
    <section className={styles.AttachmentSection}>
      <div className={styles.AttachmentHeader}>
        <div className={styles.AttachmentLabel}>{label ?? t('label')}</div>
        <label className={`${styles.AttachmentPick} ${isUploading ? 'is-busy' : ''}`}>
          <input
            type="file"
            multiple
            accept={isImageUpload ? 'image/*' : '.pdf, .docx, .pptx'}
            onChange={onPickFiles}
            disabled={isUploading}
            className={styles.AttachmentInput}
          />
          {isUploading ? t('uploading') : isImageUpload ? t('addImage') : t('addFile')}
        </label>
      </div>

      {ids.length === 0 ? (
        <div className={styles.AttachmentEmpty}>
          {isImageUpload ? t('noImages') : t('noFiles')}
        </div>
      ) : (
        <>
          {isImageUpload ? (
            <ul className={styles.AttachmentPreviewList}>
              {ids.map((id) => {
                const meta = metadataMap[id];
                const href = getAttachmentDownloadUrl(id, meta);
                return (
                  <li key={id} className={styles.AttachmentPreviewItem}>
                    <a
                      className={styles.AttachmentPreviewLink}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {isImageAttachment(meta) ? (
                        <img
                          src={href}
                          alt={meta?.original_filename || t('uploadedImageAlt')}
                          className={styles.AttachmentPreviewImage}
                        />
                      ) : (
                        <div className={styles.AttachmentPreviewFallback}>
                          {meta?.original_filename || t('imageLoading')}
                        </div>
                      )}
                    </a>
                    <div className={styles.AttachmentPreviewMeta}>
                      <span className={styles.AttachmentPreviewName}>
                        {meta?.original_filename || id}
                      </span>
                      <button
                        type="button"
                        className={styles.AttachmentRemove}
                        onClick={() => removeId(id)}
                        disabled={isUploading}
                      >
                        {t('remove')}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className={styles.AttachmentList}>
              {ids.map((id) => (
                <li key={id} className={styles.AttachmentItem}>
                  <a
                    className={styles.AttachmentLink}
                    href={getAttachmentDownloadUrl(id, metadataMap[id])}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {metadataMap[id]?.original_filename || id}
                  </a>
                  <button
                    type="button"
                    className={styles.AttachmentRemove}
                    onClick={() => removeId(id)}
                    disabled={isUploading}
                  >
                    {t('remove')}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
