'use client';

import { useCallback, useMemo, useState } from 'react';
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

  const ids = useMemo(() => (Array.isArray(valueIds) ? valueIds : []), [valueIds]);

  const onPickFiles = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || []);
      e.target.value = ''; // same file re-pick 가능하게

      if (files.length === 0) return;
      if (isUploading) return;

      setIsUploading(true);

      const uploadedIds = [];
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

          uploadedIds.push(String(data.id));
        }
      } finally {
        setIsUploading(false);
      }

      if (uploadedIds.length > 0) {
        const merged = Array.from(new Set([...ids, ...uploadedIds]));
        onChangeIds?.(merged);
      }
    },
    [ids, isUploading, onChangeIds],
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
                {id}
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
