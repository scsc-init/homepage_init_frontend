// app/article/[id]/page.jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";
import "./page.css";

export default async function ArticleDetail({ params }) {
  const { id } = params;

  const res = await fetch(`http://localhost:8080/api/article/${id}`, {
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
        >
          {article.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
