'use client';

type Article = {
  id: number;
  title: string;
  content: string | null;
  created_at: string;
  is_deleted?: boolean;
};
type BoardViewProps = { board: { id: number }; sortOrder: 'latest' | 'oldest' | 'title' };

import { fetchBackendClient } from '@/util/fetch/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useFormatter, useLocale } from 'next-intl';
import { toPlainPreview } from '@/util/toPlainPreview';
import styles from './board.module.css';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import { useTranslations } from 'next-intl';

export default function ArticlesView({ board, sortOrder }: BoardViewProps) {
  const t = useTranslations('Board');
  const format = useFormatter();
  const locale = useLocale();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const boardId = board?.id;

  useEffect(() => {
    if (!boardId) return;

    if (boardId === 1 || boardId === 2) {
      setUnauthorized(true);
      return;
    }

    const fetchContents = async () => {
      try {
        setUnauthorized(false);
        const res = await fetchBackendClient(`/api/articles/${boardId}`);
        if (res.status === 401) {
          pushLoginWithRedirect(router);
          return;
        }
        if (res.status === 403) {
          setUnauthorized(true);
          return;
        }
        if (!res.ok) {
          pushLoginWithRedirect(router);
          return;
        }
        const data: Article[] = await res.json();
        setArticles(data);
      } catch (_) {
        pushLoginWithRedirect(router);
      }
    };

    fetchContents();
  }, [router, boardId]);

  if (!board) {
    return <div className={styles.galleryEmpty}>{t('noInfo')}</div>;
  }

  if (unauthorized) {
    return <div className={styles.galleryError}>{t('noPermission')}</div>;
  }

  if (!Array.isArray(articles)) return <LoadingSpinner />;

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortOrder === 'latest')
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortOrder === 'oldest')
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortOrder === 'title') return a.title.localeCompare(b.title, locale);
    return 0;
  });
  const displayArticles = sortedArticles.filter((a) => a?.is_deleted !== true);
  return (
    <div className={styles.list}>
      {displayArticles.map((article) => (
        <Link key={article.id} href={`/article/${article.id}`} className={styles.link}>
          <div className={styles.card}>
            <div className={styles.topbar}>
              <span className={`${styles.title} ${styles.topbarItem}`}>{article.title}</span>
              <span className={`${styles.userCount} ${styles.topbarItem}`}>
                {format.dateTime(new Date(article.created_at), {
                  dateStyle: 'short',
                  timeStyle: 'medium',
                  timeZone: 'Asia/Seoul',
                })}
              </span>
            </div>
            <div className={styles.description}>{toPreview(article.content, 80)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/**
 *
 * @param {string|null} str text
 * @param {number} limit text length limit before ...(ellipsis)
 * @returns
 */
function toPreview(str: string | null, limit: number) {
  const preview = toPlainPreview(str);
  return preview ? `${preview.slice(0, limit)}${preview.length > limit ? '...' : ''}` : '';
}
