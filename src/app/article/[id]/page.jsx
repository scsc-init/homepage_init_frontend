"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";
import "./page.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Comments from "@/components/board/Comments.jsx"

export default function ArticleDetail({ params }) {
  const router = useRouter();
  const [article, setArticle] = useState();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = params;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) { 
      alert("로그인이 필요합니다.");
      router.push("/us/login"); return;
    }

    const fetchContents = async () => {
      try {
        const contentRes = await fetch(`/api/article/${id}`, {
          headers: { "x-jwt": jwt },
        });
        if (!contentRes.ok) {
          setIsError(true);
          alert("게시글 로딩 실패");
        }
        const article = await contentRes.json();
        setArticle(article);
      } catch (e) {
        setIsError(true);
        alert(`게시글 불러오기 중 오류: ${e}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContents();
  }, [router]);

  if (isLoading) {
    return (
      <div className="p-6 text-center text-red-600">
        로딩중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  const markdown = article.content ?? "내용이 비어 있습니다.";

  return (
    <div className="SigDetailContainer">
      <h1 className="SigTitle">{article.title}</h1>
      <p className="SigInfo">
        작성일: {new Date(article.created_at).toLocaleString()}
      </p>
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
      <Comments articleId={id}/>
    </div>
  );
}
