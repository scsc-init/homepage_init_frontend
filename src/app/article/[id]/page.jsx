'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { use, useEffect, useMemo, useState } from 'react';
import Comments from '@/components/board/Comments.jsx';
import LoadingSpinner from '@/components/LoadingSpinner';
import { utc2kst } from '@/util/constants';
import { useMe } from '@/util/hooks/useMe';
import { getAttachmentDownloadUrl } from '@/util/getAttachmentDownloadUrl';
import { pushLoginWithRedirect } from '@/util/loginRedirect';

export default function ArticleDetail({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const { me: user, isLoading: isMeLoading, isUnauthenticated } = useMe();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [attachmentMeta, setAttachmentMeta] = useState([]);

  useEffect(() => {
    if (!id || isMeLoading) return;
    if (isUnauthenticated || !user) {
      pushLoginWithRedirect(router);
      return;
    }

    const loadAll = async () => {
      try {
        const [contentRes, commentsRes] = await Promise.all([
          fetchBackendClient(`/api/article/${id}`),
          fetchBackendClient(`/api/comments/${id}`),
        ]);

        if (!contentRes.ok || !commentsRes.ok) {
          setIsError(true);
          return;
        }

        const [articleJson, commentsJson] = await Promise.all([
          contentRes.json(),
          commentsRes.json(),
        ]);
        setArticle(articleJson);
        setComments(commentsJson);
      } catch (_) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, [router, id, user, isMeLoading, isUnauthenticated]);

  const attachmentIds = useMemo(() => {
    if (!Array.isArray(article?.attachments)) return [];
    return article.attachments.map((val) => {
      if (typeof val === 'object' && val !== null) {
        return String(val.file_id || val.id || '');
      }
      return String(val);
    });
  }, [article?.attachments]);

  useEffect(() => {
    if (attachmentIds.length === 0) {
      setAttachmentMeta([]);
      return;
    }
    let cancelled = false;
    const fetchMeta = async () => {
      try {
        const queryParams = new URLSearchParams();
        attachmentIds.forEach((aid) => {
          if (aid) queryParams.append('ids', aid);
        });
        const res = await fetchBackendClient(`/api/file/metadata?${queryParams.toString()}`);
        const data = await res.json().catch(() => []);
        if (cancelled) return;
        if (res.ok) {
          setAttachmentMeta(Array.isArray(data) ? data : []);
        } else {
          setAttachmentMeta([]);
        }
      } catch (err) {
        console.warn('첨부 파일 정보를 불러오지 못했습니다.', err);
        if (!cancelled) setAttachmentMeta([]);
      }
    };
    fetchMeta();
    return () => {
      cancelled = true;
    };
  }, [attachmentIds]);

  const attachmentMetaMap = useMemo(() => {
    const map = new Map();
    attachmentMeta.forEach((item) => {
      const key = item?.file_id ? String(item.file_id) : item?.id ? String(item.id) : '';
      if (key) map.set(key, item);
    });
    return map;
  }, [attachmentMeta]);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !article) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const markdown = article.content ?? '내용이 비어 있습니다.';
  const isAuthor =
    user?.id != null && article?.author_id != null && user.id === article.author_id;

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setIsDeleting(true);
    try {
      const res = await fetchBackendClient(`/api/article/delete/${id}`, { method: 'POST' });
      if (res.ok) {
        const boardId = article?.board_id;
        router.push(boardId ? `/board/${boardId}` : '/');
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (_) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.DetailContainer}>
      <h1 className={styles.Title}>{article.title}</h1>
      <p className={styles.Info}>작성일 {utc2kst(article.created_at)}</p>

      {isAuthor && (
        <div className={`${styles.ActionRow} ${isDeleting ? 'is-busy' : ''}`}>
          <button className={styles.Button} onClick={() => router.push(`/article/edit/${id}`)}>
            수정
          </button>
          <button className={styles.Button} onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      )}

      <hr className={styles.Divider} />

      <div className={styles.Content}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            h1: ({ _node, className, ...props }) => (
              <h1 {...props} className={`${styles['mdx-h1']} ${className ?? ''}`.trim()} />
            ),
            h2: ({ _node, className, ...props }) => (
              <h2 {...props} className={`${styles['mdx-h2']} ${className ?? ''}`.trim()} />
            ),
            p: ({ _node, className, ...props }) => (
              <p {...props} className={`${styles['mdx-p']} ${className ?? ''}`.trim()} />
            ),
            li: ({ _node, className, ...props }) => (
              <li {...props} className={`${styles['mdx-li']} ${className ?? ''}`.trim()} />
            ),
            code: ({ _node, className, ...props }) => (
              <code
                {...props}
                className={`${styles['mdx-inline-code']} ${className ?? ''}`.trim()}
              />
            ),
            pre: ({ _node, className, ...props }) => (
              <pre {...props} className={`${styles['mdx-pre']} ${className ?? ''}`.trim()} />
            ),
            img: ({ _node, alt, className, ...props }) => (
              <img
                {...props}
                className={`${styles['mdx-img']} ${className ?? ''}`.trim()}
                alt={alt ?? ''}
              />
            ),
            table: ({ _node, className, ...props }) => (
              <div className={styles['mdx-table-wrap']}>
                <table
                  {...props}
                  className={`${styles['mdx-table']} ${className ?? ''}`.trim()}
                />
              </div>
            ),
            th: ({ _node, className, ...props }) => (
              <th
                {...props}
                className={`${styles['mdx-table-cell']} ${className ?? ''}`.trim()}
              />
            ),
            td: ({ _node, className, ...props }) => (
              <td
                {...props}
                className={`${styles['mdx-table-cell']} ${className ?? ''}`.trim()}
              />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>

        <hr className={styles.Divider} />

        {attachmentIds.length > 0 && (
          <div className="AttachmentSection">
            <div className="AttachmentHeader">
              <div className="AttachmentLabel">첨부 파일</div>
            </div>
            <ul className="AttachmentList">
              {attachmentIds.map((attachmentId) => {
                const meta = attachmentMetaMap.get(attachmentId);
                const displayName = meta?.original_filename || attachmentId;

                return (
                  <li key={attachmentId} className="AttachmentItem">
                    <a
                      className="AttachmentLink"
                      href={getAttachmentDownloadUrl(attachmentId, meta)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {displayName}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <Comments articleId={id} initialComments={comments} user={user} />
    </div>
  );
}
