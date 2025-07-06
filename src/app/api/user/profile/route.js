import { headers } from "next/headers";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export async function GET() {
  const headersList = headers();
  const jwt = headersList.get("x-jwt");
  const res = await fetch(`${getBaseUrl()}/api/user/profile`, {
    headers: {
      "x-api-secret": getApiSecret(),
      "x-jwt": jwt,
    },
    cache: "no-store",
  });
  return res;
}
