import "./header.css";
import MainHeader from "./headerComponents";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export default async function Header() {
  const res = await fetch(`${getBaseUrl()}/api/scsc/global/status`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch SCSC status");
    return <Header year={0} semester={0} />;
  }

  const scscData = await res.json();
  return <MainHeader year={scscData.year} semester={scscData.semester} />;
}
