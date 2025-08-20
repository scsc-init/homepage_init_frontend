"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";
import "./page.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Comments from "@/components/board/Comments.jsx";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ArticleDetail({ params }) {
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState(null);
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = params;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
      return;
    }
    const loadAll = async () => {
      try {
        const [contentRes, commentsRes, userRes] = await Promise.all([
          fetch(`/api/article/${id}`, { headers: { "x-jwt": jwt } }),
          fetch(`/api/comments/${id}`, { headers: { "x-jwt": jwt } }),
          fetch(`/api/user/profile`, { headers: { "x-jwt": jwt } }),
        ]);
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

  if (isLoading) return <LoadingSpinner />;

  if (isError || !article) {
    return (
      <div className="p-6 text-center text-red-600">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  const markdown = article.content ?? "내용이 비어 있습니다.";
  const isAuthor =
    user?.id != null &&
    article?.author_id != null &&
    user.id === article.author_id;

  return (
    <div className="SigDetailContainer">
      <h1 className="SigTitle">{article.title}</h1>
      <p className="SigInfo">
        작성일: {new Date(article.created_at).toLocaleString()}
      </p>

      {isAuthor && (
        <div className="SigActionRow">
          <button
            className="SigButton is-edit"
            onClick={() => router.push(`/article/edit/${id}`)}
            type="button"
          >
            수정
          </button>
        </div>
      )}

      <hr className="SigDivider" />
      <div className="SigContent">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            h1: ({ node, ...props }) => <h1 className="mdx-h1" {...props} />,
            h2: ({ node, ...props }) => <h2 className="mdx-h2" {...props} />,
            p: ({ node, ...props }) => <p className="mdx-p" {...props} />,
            li: ({ node, ...props }) => <li className="mdx-li" {...props} />,
            code: ({ node, ...props }) => (
              <code className="mdx-inline-code" {...props} />
            ),
            pre: ({ node, ...props }) => <pre className="mdx-pre" {...props} />,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
      <Comments articleId={id} initialComments={comments} user={user} />
    </div>
  );
}
