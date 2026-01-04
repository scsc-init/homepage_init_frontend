'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { directFetch } from '@/util/directFetch';

function formatBytes(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let x = v;
  let i = 0;
  while (x >= 1024 && i < units.length - 1) {
    x /= 1024;
    i += 1;
  }
  const s = i === 0 ? String(Math.round(x)) : x.toFixed(1);
  return `${s} ${units[i]}`;
}

export default function AttachmentSection({ valueIds, onChangeIds, label = '첨부파일' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [metadataMap, setMetadataMap] = useState({});

  const ids = useMemo(
    () => (Array.isArray(valueIds) ? valueIds.map((id) => String(id)) : []),
    [valueIds],
  );

  const registerMetadata = useCallback((items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    setMetadataMap((prev) => {
      const next = { ...prev };
      items.forEach((item) => {
        const key = item?.id ? String(item.id) : '';
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
        const res = await directFetch('/api/file/metadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: missingIds }),
        });
        const data = await res.json().catch(() => []);
        if (!res.ok) {
          throw new Error('failed to load metadata');
        }
        if (!cancelled) {
          registerMetadata(Array.isArray(data) ? data : []);
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
    async (e) => {
      const files = Array.from(e.target.files || []);
      e.target.value = ''; // same file re-pick 가능하게

      if (files.length === 0) return;
      if (isUploading) return;

      setIsUploading(true);

      const uploadedItems = [];
      try {
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);

          let res;
          try {
            res = await directFetch('/api/file/docs/upload', {
              method: 'POST',
              body: formData,
            });
          } catch {
            alert('파일 업로드 중 네트워크 오류가 발생했습니다.');
            continue;
          }

          let data = null;
          try {
            data = await res.json();
          } catch {
            data = null;
          }

          if (!res.ok) {
            if (res.status === 401) {
              alert('로그인이 필요합니다. 다시 로그인한 후 파일을 업로드해 주세요.');
              continue;
            }
            const msg =
              data?.detail || data?.message || `파일 업로드 실패 (status ${res.status})`;
            alert(msg);
            continue;
          }

          if (!data?.id) {
            alert('파일 업로드 응답에 id가 없습니다.');
            continue;
          }

          uploadedItems.push({
            id: String(data.id),
            original_filename: data.original_filename || file.name,
            size: data.size,
            mime_type: data.mime_type,
          });
        }
      } finally {
        setIsUploading(false);
      }

      if (uploadedItems.length > 0) {
        const merged = Array.from(new Set([...ids, ...uploadedItems.map((item) => item.id)]));
        onChangeIds?.(merged);
        registerMetadata(uploadedItems);
      }
    },
    [ids, isUploading, onChangeIds, registerMetadata],
  );

  const removeId = useCallback(
    (id) => {
      const next = ids.filter((x) => x !== id);
      onChangeIds?.(next);
    },
    [ids, onChangeIds],
  );

  return (
    <section className="AttachmentSection">
      <div className="AttachmentHeader">
        <div className="AttachmentLabel">{label}</div>
        <label className={`AttachmentPick ${isUploading ? 'is-busy' : ''}`}>
          <input
            type="file"
            multiple
            onChange={onPickFiles}
            disabled={isUploading}
            className="AttachmentInput"
          />
          {isUploading ? '업로드 중...' : '파일 추가'}
        </label>
      </div>

      {ids.length === 0 ? (
        <div className="AttachmentEmpty">첨부파일이 없습니다.</div>
      ) : (
        <ul className="AttachmentList">
          {ids.map((id) => (
            <li key={id} className="AttachmentItem">
              <a
                className="AttachmentLink"
                href={`/api/file/docs/download/${encodeURIComponent(id)}`}
                target="_blank"
                rel="noreferrer"
              >
                {metadataMap[id]?.original_filename || id}
              </a>
              <button
                type="button"
                className="AttachmentRemove"
                onClick={() => removeId(id)}
                disabled={isUploading}
                aria-label="remove attachment"
              >
                제거
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
