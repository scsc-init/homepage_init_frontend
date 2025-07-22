"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";
import "highlight.js/styles/github.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function PigContents({ pigContentId }) {
  const router = useRouter();
  const [article, setArticle] = useState();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
    }

    const fetchContents = async () => {
      try {
        const contentRes = await fetch(`/api/article/${pigContentId}`, {
          headers: { "x-jwt": jwt },
        });
        if (!contentRes.ok) {
          alert("게시글 로딩 실패");
          router.push('/pig');
        }
        const article = await contentRes.json();
        setArticle(article);
      } catch (e) {
        alert(`피그 불러오기 중 오류: ${e}`);
        router.push('/pig');
      }
    };
    fetchContents();
  }, [router, pigContentId]);

  return (
    <div className="PigContent">
      {!article ? (
        <div>로딩중...</div>
      ) : (<ReactMarkdown
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
        {article.content}
      </ReactMarkdown>)}
    </div>
  );
}
