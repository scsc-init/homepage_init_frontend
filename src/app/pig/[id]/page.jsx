// /app/pig/[id]/page.jsx
import "highlight.js/styles/github.css";
import { getApiSecret } from "@/util/getApiSecret";
import { getBaseUrl } from "@/util/getBaseUrl";
import "./page.css";
import PigJoinLeaveButton from "./PigJoinLeaveButton";
import EditPigButton from "./EditPigButton";
import PigMembers from "./PigMembers";
import PigContents from "./PigContents";

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

  return (
    <div className="PigDetailContainer">
      <h1 className="PigTitle">{pig.title}</h1>
      <p className="PigInfo">
        {pig.year}학년도 {pig.semester}학기 · 상태: {pig.status}
      </p>
      <p className="PigDescription">{pig.description}</p>
      <PigJoinLeaveButton pigId={id} />
      <EditPigButton pigId={id} />
      <hr className="PigDivider" />
      <PigContents pigContentId={pig.content_id} />
      <hr></hr>
      <PigMembers pigId={id} />
    </div>
  );
}
