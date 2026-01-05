'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';
import './page.css';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Comments from '@/components/board/Comments.jsx';
import LoadingSpinner from '@/components/LoadingSpinner';
import { utc2kst } from '@/util/constants';
import { directFetch } from '@/util/directFetch';

export default function ArticleDetail({ params }) {
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState(null);
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [attachmentMeta, setAttachmentMeta] = useState([]);
  const { id } = params;

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [contentRes, commentsRes, userRes] = await Promise.all([
          fetch(`/api/article/${id}`),
          fetch(`/api/comments/${id}`),
          fetch(`/api/user/profile`),
        ]);

        if (userRes.status === 401) {
          router.push('/us/login');
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

  const attachmentIds = useMemo(
    () =>
      Array.isArray(article?.attachments)
        ? article.attachments.map((value) => String(value))
        : [],
    [article?.attachments],
  );

  useEffect(() => {
    console.log(article);
  }, [article]);

  useEffect(() => {
    if (attachmentIds.length === 0) {
      setAttachmentMeta([]);
      return;
    }
    let cancelled = false;
    const fetchMeta = async () => {
      try {
        const params = new URLSearchParams();
        attachmentIds.forEach((id) => params.append('ids', id));
        const query = params.toString();
        const res = await directFetch(
          query ? `/api/file/metadata?${query}` : '/api/file/metadata',
        );
        const data = await res.json().catch(() => []);
        if (!res.ok) throw new Error('metadata failed');
        if (!cancelled) {
          setAttachmentMeta(Array.isArray(data) ? data : []);
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
      const key = item?.id ? String(item.id) : '';
      if (key) {
        map.set(key, item);
      }
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
        router.push(boardId ? `/board/${boardId}` : '/us/login');
      } else if (res.status === 401) {
        router.push('/us/login');
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
            type="button"
            disabled={isDeleting}
          >
            수정
          </button>
          <button
            className="SigButton is-delete"
            onClick={handleDelete}
            type="button"
            disabled={isDeleting}
          >
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
            img: ({ _node, ...props }) => (
              <img className="mdx-img" {...props} alt="article image" />
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
        {Array.isArray(article.attachments) && article.attachments.length > 0 ? (
          <>
            <div className="AttachmentSection">
              <div className="AttachmentHeader">
                <div className="AttachmentLabel">첨부파일</div>
              </div>
              <ul className="AttachmentList">
                {article.attachments.map((value) => {
                  const attachmentId = String(value);
                  return (
                    <li key={attachmentId} className="AttachmentItem">
                      <a
                        className="AttachmentLink"
                        href={`/api/file/docs/download/${encodeURIComponent(attachmentId)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {attachmentMetaMap.get(attachmentId)?.original_filename || attachmentId}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        ) : null}
      </div>
      <Comments articleId={id} initialComments={comments} user={user} />
    </div>
  );
}
