'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { minExecutiveLevel } from '@/util/constants';

function buildTree(flat) {
  const idMap = {};
  const root = [];
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

async function readErrorText(res) {
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

function Comment({ comment, onReplySubmit, userId, userRole, articleId }) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    const res = await fetch('/api/comments/create', {
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
      alert('답글 작성 실패: ' + (await readErrorText(res)));
    }
  };

  const handleDeleteReply = async () => {
    if (userId === comment.author_id) {
      const res = await fetch(`/api/comments/${comment.id}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 204) onReplySubmit();
      else alert('댓글 삭제 실패: ' + (await readErrorText(res)));
    } else {
      const res = await fetch(`/api/comments/${comment.id}/executive/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 204) onReplySubmit();
      else alert('댓글 삭제 실패: ' + (await readErrorText(res)));
    }
  };

  return (
    <div style={{ marginLeft: comment.parent_id ? 20 : 0, marginTop: 10 }}>
      <div>{comment.content}</div>
      <button onClick={() => setShowReply((v) => !v)}>
        {showReply ? '취소' : '답글 달기'}
      </button>
      {(userId === comment.author_id || userRole >= minExecutiveLevel) && (
        <button onClick={handleDeleteReply}>댓글 삭제</button>
      )}
      {showReply && (
        <div>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleReply();
            }}
          />
          <button onClick={handleReply}>작성</button>
          <button
            onClick={() => {
              setShowReply(false);
              setReplyContent('');
            }}
          >
            취소
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

export default function Comments({ articleId, initialComments, user }) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments || []);
  const [isError, setIsError] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newContent, setNewContent] = useState('');
  const newRef = useRef(null);

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
      const res = await fetch(`/api/comments/${articleId}`);
      if (res.status === 401) {
        router.push('/us/login');
        return;
      }
      if (!res.ok) {
        setIsError(true);
        return;
      }
      const commentsData = await res.json();
      setComments(commentsData);
    } catch {
      setIsError(true);
    }
  };

  const submitNew = async () => {
    if (!newContent.trim()) return;
    try {
      const res = await fetch('/api/comments/create', {
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
        alert('로그인이 필요합니다.');
        router.push('/us/login');
      } else {
        alert('댓글 작성 실패: ' + (await readErrorText(res)));
      }
    } catch (e) {
      alert('댓글 작성 실패: ' + (e?.message || '네트워크 오류'));
    }
  };

  if (isError) return <div>댓글 불러오기 실패</div>;

  const commentsTree = buildTree(comments || []);

  return (
    <div>
      <button onClick={() => setShowNew((v) => !v)}>{showNew ? '취소' : '댓글 달기'}</button>
      {showNew && (
        <div id="new-comment">
          <textarea
            ref={newRef}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submitNew();
            }}
          />
          <button onClick={submitNew}>작성</button>
          <button
            onClick={() => {
              setShowNew(false);
              setNewContent('');
            }}
          >
            취소
          </button>
        </div>
      )}
      {comments?.length === 0 ? (
        <div>댓글이 없습니다.</div>
      ) : !user ? (
        <div>유저 확인 중...</div>
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
