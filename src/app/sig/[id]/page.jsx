// /app/sig/[id]/page.jsx
"use client";

import "highlight.js/styles/github.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./page.css";
import SigJoinLeaveButton from "./SigJoinLeaveButton";
import EditSigButton from "./EditSigButton"
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function SigDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [sig, setSig] = useState(null);
  const [article, setArticle] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberNames, setMemberNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/sig/${id}`);
        if (!res.ok) {
          alert("게시글 정보 없음")
          router.push('/sig')
          return;
        }
        const sigData = await res.json();
        setSig(sigData);

        const articleRes = await fetch(`/api/article/${sigData.content_id}`);
        if (!articleRes.ok) {
          alert("게시글 로딩 실패");
          router.push("/sig")
          return;
        }
        const articleData = await articleRes.json();
        setArticle(articleData);

        const membersRes = await fetch(`/api/sig/${id}/members`);
        if (!membersRes.ok) {
          alert("시그 인원 로딩 실패");
          router.push("/sig")
          return;
        }
        const membersData = await membersRes.json();
        setMembers(membersData);
      } catch (err) {
        console.error("Fetch failed:", err);
        router.push("/sig");
      }
    };

    fetchData();
  }, [id, router]);

  useEffect(() => {
    const fetchMembers = async () => {
      try { if (!members) return;
      for (const member in members) {
        const res = await fetch(`/api/user/${member.id}`);
        const m = await res.json();
        if (res.ok) {setMemberNames([...memberNames].push(m.name))}
        else {alert("시그 인원 로딩 실패"); router.push("/sig");}
      } }
      catch (e) {
        alert(`${e}`); router.push('/sig')
      }
    };
    fetchMembers();
  }, [members])

  if (!sig || !article) return <div>로딩 중...</div>;

  return (
    <div className="SigDetailContainer">
      <h1 className="SigTitle">{sig.title}</h1>
      <p className="SigInfo">
        {sig.year}학년도 {sig.semester}학기 · 상태: {sig.status}
      </p>
      <p className="SigDescription">{sig.description}</p>
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
          {article.content}
        </ReactMarkdown>
      </div>
      <hr></hr>
      <div>
        시그 인원
        {memberNames.map((m) => (<div>{m}</div>))}
      </div>
    </div>
  );
}
