// /app/fund-apply/page.jsx
import FundApplyClient from "./FundApplyClient";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export default async function FundApplyPage() {
  const boardInfo = await fetchBoardInfo("6");
  const sigs = await fetchTargets("sig");
  const pigs = await fetchTargets("pig");

  return <FundApplyClient boardInfo={boardInfo} sigs={sigs} pigs={pigs} />;
}

async function fetchBoardInfo(id) {
  const res = await fetch(`${getBaseUrl()}/api/board/${id}`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchTargets(type) {
  const res = await fetch(`${getBaseUrl()}/api/${type}s`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();

  console.log(`[SERVER] ${type.toUpperCase()} 응답 데이터:`, data);
  return Array.isArray(data)
    ? data.filter((item) => item.status === "active")
    : [];
}
