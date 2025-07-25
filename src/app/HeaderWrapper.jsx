import "./header.css";
import Header from "./Header";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export default async function HeaderWrapper() {
  const res = await fetch(`${getBaseUrl()}/api/scsc/global/status`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch SCSC status");
    return <Header year={0} semester={0} />;
  }

  const scscData = await res.json();
  return <Header year={scscData.year} semester={scscData.semester} />;
}
