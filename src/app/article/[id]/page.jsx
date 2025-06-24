import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";
import "./page.css";
import { getBaseUrl } from "@/util/getBaseUrl";

export default async function ArticleDetail({ params }) {
  const { id } = params;

  const res = await fetch(`${getBaseUrl()}/api/article/${id}`, {
    headers: { "x-api-secret": "some-secret-code" },
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-6 text-center text-red-600">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  const article = await res.json();
  const markdown = article.content ?? "📛 내용이 비어 있습니다.";

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
    </div>
  );
}
