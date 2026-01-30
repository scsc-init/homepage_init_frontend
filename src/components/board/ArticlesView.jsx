'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { utc2kst } from '@/util/constants';
import styles from './board.module.css';
import { pushLoginWithRedirect } from '@/util/loginRedirect';

export default function ArticlesView({ board, sortOrder }) {
  const router = useRouter();
  const [articles, setArticles] = useState(null);
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
        const res = await fetch(`/api/articles/${boardId}`);
        if (res.status === 401) {
          pushLoginWithRedirect(router);
          return;
        }
        if (!res.ok) {
          pushLoginWithRedirect(router);
          return;
        }
        const data = await res.json();
        setArticles(data);
      } catch (_) {
        pushLoginWithRedirect(router);
      }
    };

    fetchContents();
  }, [router, boardId]);

  if (!board) {
    return <div className="text-center text-red-600 mt-10">게시판 정보가 없습니다.</div>;
  }

  if (unauthorized) {
    return <div className="text-center text-red-600 mt-10">권한이 부족합니다.</div>;
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
    <div id="SigList">
      {displayArticles.map((article) => (
        <Link key={article.id} href={`/article/${article.id}`} className={styles.sigLink}>
          <div className={styles.sigCard}>
            <div className={styles.sigTopbar}>
              <span className={styles.sigTitle}>{article.title}</span>
              <span className={styles.sigUserCount}>{utc2kst(article.created_at)}</span>
            </div>
            <div className={styles.sigDescription}>
              {article.content.replace(/\s+/g, ' ').trim().slice(0, 80)}...
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
