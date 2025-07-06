import { headers } from "next/headers";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export async function POST(request, { params }) {
  const headersList = headers();
  const jwt = headersList.get("x-jwt");
  const { id } = await params;
  const res = await fetch(
    `${getBaseUrl()}/api/executive/article/delete/${id}`,
    {
      method: "POST",
      headers: {
        "x-api-secret": getApiSecret(),
        "x-jwt": jwt,
      },
      cache: "no-store",
    },
  );
  return res;
}
