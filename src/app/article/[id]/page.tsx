'use client';

type Article = {
  id: number;
  title: string;
  author_id: string;
  board_id: number;
  created_at: string;
  content: string | null;
  attachments: { id: number; article_id: number; file_id: string }[];
};
type ArticleComment = {
  id: number;
  content: string;
  author_id: string;
  article_id: number;
  parent_id: number | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
type FileMetadata = {
  id: string;
  file_id?: string;
  original_filename?: string;
  mime_type?: string;
};

import { fetchBackendClient } from '@/util/fetch/client';
import ReactMarkdown, { type ExtraProps } from 'react-markdown';
import type { ComponentProps, ReactNode } from 'react';

type LegacyMarkdownComponents = {
  [
    Tag in 'h1' | 'h2' | 'p' | 'li' | 'code' | 'pre' | 'img' | 'input' | 'table' | 'th' | 'td'
  ]: (props: ComponentProps<Tag> & ExtraProps & { _node?: unknown }) => ReactNode;
};
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';
import styles from './page.module.css';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Comments from './Comments';
import LoadingSpinner from '@/components/LoadingSpinner';
import { isPublicBoardId } from '@/util/constants';
import { useMe } from '@/util/hooks/useMe';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import AttachmentList from '@/components/form-control/AttachmentList';
import MarkdownInput from '@/components/form-control/MarkdownInput';
import { useFormatter, useTranslations } from 'next-intl';
import { parseUtcDate } from '@/util/date';

export default function ArticleDetail() {
  const t = useTranslations('Article');
  const format = useFormatter();
  const { id } = useParams<{ id: string }>();

  const router = useRouter();
  const { me: user, isLoading: isMeLoading, isUnauthenticated } = useMe();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<ArticleComment[] | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [attachmentMeta, setAttachmentMeta] = useState<FileMetadata[]>([]);

  useEffect(() => {
    if (!id || isMeLoading) return;

    const loadAll = async () => {
      try {
        const contentRes = await fetchBackendClient(`/api/article/${id}`);

        if (!contentRes.ok) {
          if (contentRes.status === 401 && (isUnauthenticated || !user)) {
            pushLoginWithRedirect(router);
            return;
          }
          setIsError(true);
          return;
        }

        const articleJson: Article = await contentRes.json();
        if (!user && !isPublicBoardId(articleJson?.board_id)) {
          pushLoginWithRedirect(router);
          return;
        }

        setArticle(articleJson);

        if (user) {
          const commentsRes = await fetchBackendClient(`/api/comments/${id}`);
          if (!commentsRes.ok) {
            setIsError(true);
            return;
          }
          setComments(await commentsRes.json());
        }
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
        const data: FileMetadata[] = await res.json().catch(() => []);
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
    const map = new Map<string, FileMetadata>();
    attachmentMeta.forEach((item) => {
      const key = item?.file_id ? String(item.file_id) : item?.id ? String(item.id) : '';
      if (key) map.set(key, item);
    });
    return map;
  }, [attachmentMeta]);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !article) {
    return <div>{t('notFound')}</div>;
  }

  const markdown = article.content ?? t('emptyContent');
  const isAuthor =
    user?.id != null && article?.author_id != null && user.id === article.author_id;

  const handleDelete = async () => {
    if (!window.confirm(t('deleteConfirm'))) return;
    setIsDeleting(true);
    try {
      const res = await fetchBackendClient(`/api/article/delete/${id}`, { method: 'POST' });
      if (res.ok) {
        const boardId = article?.board_id;
        router.push(boardId ? `/board/${boardId}` : '/');
      } else {
        alert(t('deleteFailed'));
      }
    } catch (_) {
      alert(t('deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.DetailContainer}>
      <h1 className={styles.Title}>{article.title}</h1>
      <p className={styles.Info}>
        {t('createdAt', {
          date: format.dateTime(parseUtcDate(article.created_at), {
            dateStyle: 'short',
            timeStyle: 'medium',
            timeZone: 'Asia/Seoul',
          }),
        })}
      </p>

      {isAuthor && (
        <div className={`${styles.ActionRow} ${isDeleting ? 'is-busy' : ''}`}>
          <button className={styles.Button} onClick={() => router.push(`/article/edit/${id}`)}>
            {t('edit')}
          </button>
          <button className={styles.Button} onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? t('deleting') : t('delete')}
          </button>
        </div>
      )}

      <hr className={styles.Divider} />

      <div className={styles.Content}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={
            {
              input: MarkdownInput,
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
            } satisfies LegacyMarkdownComponents
          }
        >
          {markdown}
        </ReactMarkdown>

        {attachmentIds.length > 0 && (
          <>
            <hr className={styles.Divider} />
            <AttachmentList
              attachmentIds={attachmentIds}
              attachmentMetaMap={attachmentMetaMap}
            />
          </>
        )}
      </div>
      {user && <Comments articleId={id} initialComments={comments} user={user} />}
    </div>
  );
}
