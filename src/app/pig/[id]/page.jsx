import "highlight.js/styles/github.css";
import { getApiSecret } from "@/util/getApiSecret";
import { getBaseUrl } from "@/util/getBaseUrl";
import "./page.css";
import PigClient from "./PigClient";

export const metadata = { title: "SIG" };

export default async function PigDetailPage({ params }) {
  const { id } = params;

  const pigRes = await fetch(`${getBaseUrl()}/api/pig/${id}`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (!pigRes.ok) {
    return (
      <div className="p-6 text-center text-red-600">
        존재하지 않는 PIG입니다.
      </div>
    );
  }
  const pig = await pigRes.json();

  const membersRes = await fetch(`${getBaseUrl()}/api/pig/${id}/members`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  const rawMembers = membersRes.ok ? await membersRes.json() : [];
  const members = Array.isArray(rawMembers)
    ? rawMembers.map((m) => m.user ?? m)
    : [];

  return (
    <PigClient
      pig={pig}
      members={members}
      articleId={pig.content_id}
      pigId={id}
    />
  );
}
