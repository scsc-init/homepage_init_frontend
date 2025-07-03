// /app/pig/[id]/page.jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";
import "./page.css";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export default async function PigDetailPage({ params }) {
  const { id } = params;

  const res = await fetch(`${getBaseUrl()}/api/pig/${id}`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-6 text-center text-red-600">
        존재하지 않는 PIG입니다.
      </div>
    );
  }

  const pig = await res.json();

  const articleRes = await fetch(
    `${getBaseUrl()}/api/article/${pig.content_id}`,
    {
      headers: { "x-api-secret": getApiSecret() },
      cache: "no-store",
    },
  );

  if (!articleRes.ok) {
    return <div className="p-6 text-center text-red-600">게시글 로딩 실패</div>;
  }

  const article = await articleRes.json();

  return (
    <div className="PigDetailContainer">
      <h1 className="PigTitle">{pig.title}</h1>
      <p className="PigInfo">
        {pig.year}학년도 {pig.semester}학기 · 상태: {pig.status}
      </p>
      <p className="PigDescription">{pig.description}</p>
      <hr className="PigDivider" />
      <div className="PigContent">
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
          {article.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
