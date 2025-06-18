// /app/sig/[id]/page.jsx - SIG 상세 페이지 (Markdown 렌더링 + 스타일 적용)
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // 코드 블럭용 스타일

export default async function SigDetailPage({ params }) {
  const { id } = params;

  // SIG 정보 불러오기
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

  // 해당 SIG의 게시글 (article) 불러오기
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{sig.title}</h1>
      <p className="text-gray-600 mb-2">
        {sig.year}학년도 {sig.semester}학기 · 상태: {sig.status}
      </p>
      <p className="mb-6 text-gray-700">{sig.description}</p>
      <hr className="my-6" />
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold my-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-800 my-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="list-disc list-inside" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="bg-gray-100 px-1 rounded text-sm" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre
              className="bg-gray-100 p-3 rounded overflow-x-auto"
              {...props}
            />
          ),
        }}
      >
        {article.content}
      </ReactMarkdown>
    </div>
  );
}
