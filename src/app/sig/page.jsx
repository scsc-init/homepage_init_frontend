import "./page.css";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";
import SigListClient from "./SigListClient";

export default async function SigListPage() {
  const res = await fetch(`${getBaseUrl()}/api/sigs`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>시그 정보를 불러올 수 없습니다.</div>;
  }

  const sigs = await res.json();
  if (!Array.isArray(sigs)) return <div>로딩중...</div>;

  return (
    <div id="SigListContainer">
      <SigListClient sigs={sigs} />
    </div>
  );
}
