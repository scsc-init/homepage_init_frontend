'use client';

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
import type { UserProfile } from '@/types/user';
type CommentNode = ArticleComment & { children: CommentNode[] };
type CommentProps = {
  comment: CommentNode;
  onReplySubmit: () => void | Promise<void>;
  userId: string;
  userRole: number;
  articleId: string;
};

import { fetchBackendClient } from '@/util/fetch/client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { minExecutiveLevel } from '@/util/constants';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import styles from './Comments.module.css';
import { useTranslations } from 'next-intl';

function buildTree(comments: ArticleComment[]): CommentNode[] {
  // The original routine adds children to each input comment before linking the tree.
  const flat = comments as CommentNode[];
  const idMap: Record<number, CommentNode> = {};
  const root: CommentNode[] = [];
  flat.forEach((el) => {
    el.children = [];
    idMap[el.id] = el;
  });
  flat.forEach((el) => {
    el.parent_id ? idMap[el.parent_id]?.children.push(el) : root.push(el);
  });
  flat.forEach((el) => el.children.sort((a, b) => a.id - b.id));
  root.sort((a, b) => a.id - b.id);
  return root;
}

async function readErrorText(res: Response) {
  const base = `HTTP ${res.status}`;
  const ct = res.headers.get('content-type') || '';
  try {
    if (ct.includes('application/json')) {
      const body = await res.json();
      const detail = body?.detail ?? body?.message ?? body?.error ?? body?.errors;
      return typeof detail === 'string'
        ? `${base} - ${detail}`
        : `${base} - ${JSON.stringify(detail)}`;
    }
    const text = await res.text();
    return text ? `${base} - ${text}` : base;
  } catch {
    return base;
  }
}

function Comment({ comment, onReplySubmit, userId, userRole, articleId }: CommentProps) {
  const t = useTranslations('Comments');
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    try {
      const res = await fetchBackendClient('/api/comments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: Number(articleId),
          parent_id: comment.id,
          content: replyContent,
        }),
      });
      if (res.ok) {
        setReplyContent('');
        setShowReply(false);
        onReplySubmit();
      } else {
        alert(t('replyFailed', { error: await readErrorText(res) }));
      }
    } catch (err) {
      alert(
        t('replyFailed', { error: err instanceof Error ? err.message : t('networkError') }),
      );
    }
  };

  const handleDeleteReply = async () => {
    try {
      const path =
        userId === comment.author_id
          ? `/api/comments/${comment.id}/delete`
          : `/api/comments/${comment.id}/executive/delete`;

      const res = await fetchBackendClient(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 204) onReplySubmit();
      else alert(t('commentDeleteFailed', { error: await readErrorText(res) }));
    } catch (err) {
      alert(
        t('commentDeleteFailed', {
          error: err instanceof Error ? err.message : t('networkError'),
        }),
      );
    }
  };

  return (
    <div
      className={styles.Comment}
      style={{ marginLeft: comment.parent_id ? 20 : 0, marginTop: 10 }}
    >
      <div className={styles.CommentContent}>{comment.content}</div>
      <button className={styles.Button} onClick={() => setShowReply((v) => !v)}>
        {showReply ? t('cancel') : t('reply')}
      </button>
      {(userId === comment.author_id || userRole >= minExecutiveLevel) && (
        <button className={styles.Button} onClick={handleDeleteReply}>
          {t('delete')}
        </button>
      )}
      {showReply && (
        <div className={styles.ReplyEditor}>
          <textarea
            className={styles.Textarea}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={t('replyPlaceholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleReply();
            }}
          />
          <button className={styles.Button} onClick={handleReply}>
            {t('submit')}
          </button>
          <button
            className={styles.Button}
            onClick={() => {
              setShowReply(false);
              setReplyContent('');
            }}
          >
            {t('cancel')}
          </button>
        </div>
      )}
      {comment.children?.length > 0 &&
        comment.children.map((child) => (
          <Comment
            key={child.id}
            comment={child}
            onReplySubmit={onReplySubmit}
            userId={userId}
            userRole={userRole}
            articleId={articleId}
          />
        ))}
    </div>
  );
}

export default function Comments({
  articleId,
  initialComments,
  user,
}: {
  articleId: string;
  initialComments: ArticleComment[] | null;
  user: UserProfile | null;
}) {
  const t = useTranslations('Comments');
  const router = useRouter();
  const [comments, setComments] = useState(initialComments || []);
  const [isError, setIsError] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newContent, setNewContent] = useState('');
  const newRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!initialComments || !user) router.refresh();
  }, [initialComments, user, router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#new-comment') {
      setShowNew(true);
      setTimeout(() => newRef.current?.focus(), 0);
    }
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetchBackendClient(`/api/comments/${articleId}`);
      if (res.status === 401) {
        pushLoginWithRedirect(router);
        return;
      }
      if (!res.ok) {
        setIsError(true);
        return;
      }
      const commentsData: ArticleComment[] = await res.json();
      setComments(commentsData);
    } catch {
      setIsError(true);
    }
  };

  const submitNew = async () => {
    if (!newContent.trim()) return;
    try {
      const res = await fetchBackendClient('/api/comments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: Number(articleId),
          parent_id: null,
          content: newContent,
        }),
      });
      if (res.ok) {
        setNewContent('');
        setShowNew(false);
        await fetchComments();
      } else if (res.status === 401) {
        alert(t('loginRequired'));
        pushLoginWithRedirect(router);
      } else {
        alert(t('commentFailed', { error: await readErrorText(res) }));
      }
    } catch (e) {
      alert(
        t('commentFailed', {
          error: (e as { message?: string } | null)?.message || t('networkError'),
        }),
      );
    }
  };

  if (isError) return <div className={styles.Status}>{t('loadFailed')}</div>;

  const commentsTree = buildTree(comments || []);

  return (
    <div className={styles.Comments}>
      <button
        className={`${styles.Button} ${styles.ToggleButton}`}
        onClick={() => setShowNew((v) => !v)}
      >
        {showNew ? t('cancel') : t('addComment')}
      </button>
      {showNew && (
        <div id="new-comment" className={styles.NewCommentEditor}>
          <textarea
            className={styles.Textarea}
            ref={newRef}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={t('commentPlaceholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submitNew();
            }}
          />
          <button className={styles.Button} onClick={submitNew}>
            {t('submit')}
          </button>
          <button
            className={styles.Button}
            onClick={() => {
              setShowNew(false);
              setNewContent('');
            }}
          >
            {t('cancel')}
          </button>
        </div>
      )}
      {comments?.length === 0 ? (
        <div className={styles.Status}>{t('empty')}</div>
      ) : !user ? (
        <div className={styles.Status}>{t('checkingUser')}</div>
      ) : (
        commentsTree.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReplySubmit={fetchComments}
            userId={user.id}
            userRole={user.role}
            articleId={articleId}
          />
        ))
      )}
    </div>
  );
}
