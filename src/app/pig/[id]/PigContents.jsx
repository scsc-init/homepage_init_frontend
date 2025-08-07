"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";
import "highlight.js/styles/github.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PigContents({ pigContentId }) {
  const router = useRouter();
  const [article, setArticle] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    const fetchContents = async () => {
      try {
        const contentRes = await fetch(`/api/article/${pigContentId}`, {
          headers: { "x-jwt": jwt },
        });
        if (!contentRes.ok) {
          router.push("/pig");
          return;
        }
        const article = await contentRes.json();
        setArticle(article);
      } catch (e) {
        router.push("/pig");
      } finally {
        setLoading(false);
      }
    };

    if (!jwt) {
      router.push("/us/login");
      setLoading(false);
      return;
    }

    fetchContents();
  }, [router, pigContentId]);

  return (
    <div className="PigContent">
      {loading ? (
        <LoadingSpinner />
      ) : (
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
          {article?.content}
        </ReactMarkdown>
      )}
    </div>
  );
}
