// /app/sig/[id]/page.jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";
import "./page.css";

export default async function SigDetailPage({ params }) {
  const { id } = params;

  const res = await fetch(`http://localhost:8080/api/sig/${id}`, {
    headers: { "x-api-secret": "some-secret-code" },
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-6 text-center text-red-600">
        존재하지 않는 SIG입니다.
      </div>
    );
  }

  const sig = await res.json();

  const articleRes = await fetch(
    `http://localhost:8080/api/article/${sig.content_id}`,
    {
      headers: { "x-api-secret": "some-secret-code" },
      cache: "no-store",
    },
  );

  if (!articleRes.ok) {
    return <div className="p-6 text-center text-red-600">게시글 로딩 실패</div>;
  }

  const article = await articleRes.json();
  console.log(article);

  // ✅ markdown 파일 내용 가져오기
  const contentRes = await fetch(
    `http://localhost:8080/articles/${article.id}.md`, // 백엔드에서 파일을 서빙하는 경로여야 함
    { cache: "no-store" },
  );

  const markdown = contentRes.ok
    ? await contentRes.text()
    : "내용을 불러올 수 없습니다.";

  return (
    <div className="SigDetailContainer">
      <h1 className="SigTitle">{sig.title}</h1>
      <p className="SigInfo">
        {sig.year}학년도 {sig.semester}학기 · 상태: {sig.status}
      </p>
      <p className="SigDescription">{sig.description}</p>
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
