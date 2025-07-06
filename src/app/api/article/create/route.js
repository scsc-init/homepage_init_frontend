import { headers } from "next/headers";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export async function POST(request) {
  const headersList = headers();
  const jwt = headersList.get("x-jwt");
  const body = await request.json();
  const res = await fetch(`${getBaseUrl()}/api/article/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-secret": getApiSecret(),
      "x-jwt": jwt,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return res;
}
