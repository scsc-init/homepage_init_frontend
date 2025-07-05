import { headers } from "next/headers";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export async function POST(request) {
  const headersList = headers();
  const jwt = headersList.get("x-jwt");
  const formData = await request.formData();
  const res = await fetch(
    `${getBaseUrl()}/api/executive/user/standby/process`,
    {
      method: "POST",
      headers: { "x-api-secret": getApiSecret(), "x-jwt": jwt },
      body: formData,
      cache: "no-store",
    },
  );
  return res;
}
