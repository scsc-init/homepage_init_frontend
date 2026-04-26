'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';
import './page.css';
import { useRouter } from 'next/navigation';
import { use, useEffect, useMemo, useState } from 'react';
import Comments from '@/components/board/Comments.jsx';
import LoadingSpinner from '@/components/LoadingSpinner';
import { utc2kst } from '@/util/constants';
import { directFetch } from '@/util/directFetch';
import { getAttachmentDownloadUrl } from '@/util/getAttachmentDownloadUrl';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import Image from 'next/image';

export default function ArticleDetail({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState(null);
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [attachmentMeta, setAttachmentMeta] = useState([]);

  useEffect(() => {
    if (!id) return;
    const loadAll = async () => {
      try {
        const [contentRes, commentsRes, userRes] = await Promise.all([
          fetch(`/api/article/${id}`),
          fetch(`/api/comments/${id}`),
          fetch(`/api/user/profile`),
        ]);

        if (userRes.status === 401) {
          pushLoginWithRedirect(router);
          return;
        }
        if (!contentRes.ok || !commentsRes.ok || !userRes.ok) {
          setIsError(true);
          return;
        }

        const [articleJson, commentsJson, userJson] = await Promise.all([
          contentRes.json(),
          commentsRes.json(),
          userRes.json(),
        ]);
        setArticle(articleJson);
        setComments(commentsJson);
        setUser(userJson);
      } catch (_) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, [router, id]);

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
        const res = await directFetch(`/api/file/metadata?${queryParams.toString()}`);
        const data = await res.json().catch(() => []);
        if (cancelled) return;
        if (res.ok) {
          setAttachmentMeta(Array.isArray(data) ? data : []);
        } else {
          setAttachmentMeta([]);
        }
      } catch (err) {
        console.warn('첨부파일 정보를 불러오지 못했습니다.', err);
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
    return <div className="p-6 text-center text-red-600">게시글을 찾을 수 없습니다.</div>;
  }

  const markdown = article.content ?? '내용이 비어 있습니다.';
  const isAuthor =
    user?.id != null && article?.author_id != null && user.id === article.author_id;

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/article/delete/${id}`, { method: 'POST' });
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
    <div className="SigDetailContainer">
      <h1 className="SigTitle">{article.title}</h1>
      <p className="SigInfo">작성일: {utc2kst(article.created_at)}</p>

      {isAuthor && (
        <div className={`SigActionRow ${isDeleting ? 'is-busy' : ''}`}>
          <button
            className="SigButton is-edit"
            onClick={() => router.push(`/article/edit/${id}`)}
          >
            수정
          </button>
          <button className="SigButton is-delete" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      )}

      <hr className="SigDivider" />

      <div className="SigContent">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            h1: ({ _node, ...props }) => <h1 className="mdx-h1" {...props} />,
            h2: ({ _node, ...props }) => <h2 className="mdx-h2" {...props} />,
            p: ({ _node, ...props }) => <p className="mdx-p" {...props} />,
            li: ({ _node, ...props }) => <li className="mdx-li" {...props} />,
            code: ({ _node, ...props }) => <code className="mdx-inline-code" {...props} />,
            pre: ({ _node, ...props }) => <pre className="mdx-pre" {...props} />,
            img: ({ _node, alt, ...props }) => (
              <img className="mdx-img" alt={alt ?? ''} {...props} />
            ),
            table: ({ _node, ...props }) => (
              <div className="mdx-table-wrap">
                <table {...props} />
              </div>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>

        <hr className="SigDivider" />

        {attachmentIds.length > 0 && (
          <div className="AttachmentSection">
            <div className="AttachmentHeader">
              <div className="AttachmentLabel">첨부파일</div>
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
