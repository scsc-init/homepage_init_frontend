// /app/sig/[id]/page.jsx
import "highlight.js/styles/github.css";
import { getApiSecret } from "@/util/getApiSecret";
import { getBaseUrl } from "@/util/getBaseUrl";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./page.css";
import SigJoinLeaveButton from "./SigJoinLeaveButton";
import EditSigButton from "./EditSigButton"

export default async function SigDetailPage({ params }) {
  const { id } = params;

  const res = await fetch(`${getBaseUrl()}/api/sig/${id}`, {
    headers: { "x-api-secret": getApiSecret() },
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
    `${getBaseUrl()}/api/article/${sig.content_id}`,
    {
      headers: { "x-api-secret": getApiSecret() },
      cache: "no-store",
    },
  );

  if (!articleRes.ok) {
    console.log(articleRes)
    return <div className="p-6 text-center text-red-600">게시글 로딩 실패</div>;
  }

  const article = await articleRes.json();

  const membersRes = await fetch(`${getBaseUrl()}/api/sig/${id}/members`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (!membersRes.ok) {
    return <div>시그 인원 로딩 실패</div>;
  }
  const membersData = await membersRes.json();

  const memberNamePromises = membersData.map(async (member) => {
    const res = await fetch(`${baseUrl}/api/user/${member.id}`, {
      headers: { "x-api-secret": secret },
      cache: "no-store",
    });
    if (!res.ok) return "이름 불러오기 실패";
    const user = await res.json();
    return user.name;
  });

  const memberNames = await Promise.all(memberNamePromises);

  if (!sig || !article) return <div>로딩 중...</div>;

  return (
    <div className="SigDetailContainer">
      <h1 className="SigTitle">{sigData.title}</h1>
      <p className="SigInfo">
        {sigData.year}학년도 {sigData.semester}학기 · 상태: {sigData.status}
      </p>
      <p className="SigDescription">{sigData.description}</p>
      <SigJoinLeaveButton sigId={id}/>
      <EditSigButton sigId={id}/>
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
          {articleData.content}
        </ReactMarkdown>
      </div>
      <hr></hr>
      <div>
        시그 인원
        {memberNames.map((m, idx) => (<div key={idx}>{m}</div>))}
      </div>
    </div>
  );
}
