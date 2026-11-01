'use client';

type AttachmentRef = string | { file_id?: string; id?: string };
type Article = {
  id: number;
  title: string;
  content: string | null;
  created_at: string;
  attachments: AttachmentRef[];
  is_deleted?: boolean;
};
type FileMetadata = {
  id: string;
  file_id?: string;
  original_filename?: string;
  mime_type?: string;
};
type BoardViewProps = { board: { id: number }; sortOrder: 'latest' | 'oldest' | 'title' };

import { fetchBackendClient } from '@/util/fetch/client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useFormatter } from 'next-intl';
import { getAttachmentDownloadUrl } from '@/util/getAttachmentDownloadUrl';
import { toPlainPreview } from '@/util/toPlainPreview';
import styles from './board.module.css';
import { useTranslations } from 'next-intl';

const METADATA_CHUNK_SIZE = 30;

export default function FileBoardView({ board, sortOrder }: BoardViewProps) {
  const t = useTranslations('Board');
  const format = useFormatter();
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [metadataMap, setMetadataMap] = useState<Record<string, FileMetadata>>({});
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
        const data: Article[] = await res.json();
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
        const next: Record<string, FileMetadata> = {};

        for (let i = 0; i < attachmentIds.length; i += METADATA_CHUNK_SIZE) {
          const params = new URLSearchParams();
          attachmentIds
            .slice(i, i + METADATA_CHUNK_SIZE)
            .forEach((id) => params.append('ids', id));

          const res = await fetchBackendClient(`/api/file/metadata?${params.toString()}`);
          const data: FileMetadata[] = await res.json().catch(() => []);
          if (!res.ok || cancelled) return;

          (Array.isArray(data) ? data : []).forEach((item) => {
            const key = item?.file_id ? String(item.file_id) : item?.id ? String(item.id) : '';
            if (key) next[key] = item;
          });
        }

        if (cancelled) return;
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
    return <div className="text-center text-red-600 mt-10">{t('noInfo')}</div>;
  }

  if (unauthorized) {
    return <div className="text-center text-red-600 mt-10">{t('noPermissionShort')}</div>;
  }

  if (!Array.isArray(articles)) return <LoadingSpinner />;

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortOrder === 'latest')
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortOrder === 'oldest')
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
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
        const primaryMeta = primaryId ? metadataMap[primaryId] : undefined;
        const primaryName = primaryMeta?.original_filename || primaryId || t('attachment');
        const primaryHref = primaryId ? getAttachmentDownloadUrl(primaryId, primaryMeta) : '';
        const preview = toPlainPreview(article.content);

        return (
          <div key={article.id} className={styles.fileCard}>
            <div className={styles.fileTopbar}>
              <Link href={`/article/${article.id}`} className={styles.fileTitle}>
                {article.title}
              </Link>
              <span className={styles.fileDate}>
                {format.dateTime(new Date(article.created_at), {
                  dateStyle: 'short',
                  timeStyle: 'medium',
                  timeZone: 'Asia/Seoul',
                })}
              </span>
            </div>

            {preview ? <div className={styles.fileDescription}>{preview}</div> : null}

            <div className={styles.fileAttachmentRow}>
              <span className={styles.fileAttachmentBadge}>
                {t('attachmentsCount', { count: ids.length })}
              </span>
              {primaryHref ? (
                <>
                  <a
                    href={primaryHref}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.fileAttachmentLink}
                  >
                    {primaryName}
                  </a>
                  {ids.length > 1 ? <span>...</span> : null}
                </>
              ) : (
                <span className={styles.fileEmpty}>{t('attachmentInfoMissing')}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
