// /app/pig/[id]/page.jsx
"use client";

import "highlight.js/styles/github.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./page.css";
import PigJoinLeaveButton from "./PigJoinLeaveButton";
import EditPigButton from "./EditPigButton"
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function PigDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [pig, setPig] = useState(null);
  const [article, setArticle] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberNames, setMemberNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/pig/${id}`);
        if (!res.ok) {
          alert("게시글 정보 없음")
          router.push('/pig')
          return;
        }
        const pigData = await res.json();
        setPig(pigData);

        const articleRes = await fetch(`/api/article/${pigData.content_id}`);
        if (!articleRes.ok) {
          alert("게시글 로딩 실패");
          router.push("/pig")
          return;
        }
        const articleData = await articleRes.json();
        setArticle(articleData);

        const membersRes = await fetch(`/api/pig/${id}/members`);
        if (!membersRes.ok) {
          alert("피그 인원 로딩 실패");
          router.push("/pig")
          return;
        }
        const membersData = await membersRes.json();
        setMembers(membersData);
      } catch (err) {
        console.error("Fetch failed:", err);
        router.push("/pig");
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
        else {alert("피그 인원 로딩 실패"); router.push("/pig");}
      } }
      catch (e) {
        alert(`${e}`); router.push('/pig')
      }
    };
    fetchMembers();
  }, [members])

  if (!pig || !article) return <div>로딩 중...</div>;

  return (
    <div className="PigDetailContainer">
      <h1 className="PigTitle">{pig.title}</h1>
      <p className="PigInfo">
        {pig.year}학년도 {pig.semester}학기 · 상태: {pig.status}
      </p>
      <p className="PigDescription">{pig.description}</p>
      <PigJoinLeaveButton pigId={id}/>
      <EditPigButton pigId={id}/>
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
      <hr></hr>
      <div>
        피그 인원
        {memberNames.map((m, idx) => (<div key={idx}>{m}</div>))}
      </div>
    </div>
  );
}
