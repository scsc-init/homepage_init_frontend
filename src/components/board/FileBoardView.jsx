'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { utc2kst } from '@/util/constants';
import { getAttachmentDownloadUrl } from '@/util/getAttachmentDownloadUrl';
import styles from './board.module.css';

export default function FileBoardView({ board, sortOrder }) {
  const [articles, setArticles] = useState(null);
  const [metadataMap, setMetadataMap] = useState({});
  const [unauthorized, setUnauthorized] = useState(false);

  const boardId = board?.id;

  useEffect(() => {
    if (!boardId) return;

    const fetchContents = async () => {
      try {
        setUnauthorized(false);
        const res = await fetchBackendClient(`/api/articles/${boardId}`);
        if (res.status === 401 || res.status === 403) {
          setUnauthorized(true);
          return;
        }
        if (!res.ok) {
          setUnauthorized(true);
          return;
        }
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (_) {
        setUnauthorized(true);
      }
    };

    fetchContents();
  }, [boardId]);

  const attachmentIds = useMemo(() => {
    if (!Array.isArray(articles)) return [];

    return Array.from(
      new Set(
        articles
          .flatMap((article) => (Array.isArray(article.attachments) ? article.attachments : []))
          .map((item) => {
            if (typeof item === 'object' && item !== null) {
              return String(item.file_id || item.id || '');
            }
            return String(item || '');
          })
          .filter(Boolean),
      ),
    );
  }, [articles]);

  useEffect(() => {
    if (attachmentIds.length === 0) {
      setMetadataMap({});
      return;
    }

    let cancelled = false;

    const fetchMetadata = async () => {
      try {
        const params = new URLSearchParams();
        attachmentIds.forEach((id) => params.append('ids', id));
        const res = await fetchBackendClient(`/api/file/metadata?${params.toString()}`);
        const data = await res.json().catch(() => []);
        if (!res.ok || cancelled) return;

        const next = {};
        (Array.isArray(data) ? data : []).forEach((item) => {
          const key = item?.file_id ? String(item.file_id) : item?.id ? String(item.id) : '';
          if (key) next[key] = item;
        });
        setMetadataMap(next);
      } catch (_) {
        if (!cancelled) setMetadataMap({});
      }
    };

    fetchMetadata();
    return () => {
      cancelled = true;
    };
  }, [attachmentIds]);

  if (!board) {
    return <div className="text-center text-red-600 mt-10"> 게시판 정보가 없습니다.</div>;
  }

  if (unauthorized) {
    return <div className="text-center text-red-600 mt-10"> 권한이 없습니다.</div>;
  }

  if (!Array.isArray(articles)) return <LoadingSpinner />;

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortOrder === 'latest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortOrder === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortOrder === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const displayArticles = sortedArticles.filter((a) => a?.is_deleted !== true);

  return (
    <div className={styles.fileList}>
      {displayArticles.map((article) => {
        const ids = (Array.isArray(article.attachments) ? article.attachments : []).map(
          (item) => {
            if (typeof item === 'object' && item !== null) {
              return String(item.file_id || item.id || '');
            }
            return String(item || '');
          },
        );

        const primaryId = ids[0];
        const primaryMeta = primaryId ? metadataMap[primaryId] : null;
        const primaryName = primaryMeta?.original_filename || primaryId || '첨부파일';
        const primaryHref = primaryId ? getAttachmentDownloadUrl(primaryId, primaryMeta) : '';
        const preview = String(article.content || '')
          .replace(/\s+/g, ' ')
          .trim();

        return (
          <div key={article.id} className={styles.fileCard}>
            <div className={styles.fileTopbar}>
              <Link href={`/article/${article.id}`} className={styles.fileTitle}>
                {article.title}
              </Link>
              <span className={styles.fileDate}>{utc2kst(article.created_at)}</span>
            </div>

            {preview ? <div className={styles.fileDescription}>{preview}</div> : null}

            <div className={styles.fileAttachmentRow}>
              <span className={styles.fileAttachmentBadge}>첨부 {ids.length}개</span>
              {primaryHref ? (
                <a
                  href={primaryHref}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.fileAttachmentLink}
                >
                  {primaryName}
                </a>
              ) : (
                <span className={styles.fileEmpty}>첨부파일 정보 없음</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
