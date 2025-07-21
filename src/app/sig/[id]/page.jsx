// /app/sig/[id]/page.jsx
import "highlight.js/styles/github.css";
import { getApiSecret } from "@/util/getApiSecret";
import { getBaseUrl } from "@/util/getBaseUrl";
import "./page.css";
import SigJoinLeaveButton from "./SigJoinLeaveButton";
import EditSigButton from "./EditSigButton"
import SigMembers from "./SigMembers"
import SigContents from "./SigContents"

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
      <SigContents sigContentId={sig.content_id}/>
      <hr></hr>
      <SigMembers sigId={id}/>
    </div>
  );
}
