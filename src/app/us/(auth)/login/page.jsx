import { getBaseUrl } from "@/util/getBaseUrl";
import AuthClient from "./AuthClient";
import { getApiSecret } from "@/util/getApiSecret";

export default async function Page() {
  const discordLogin = async () => {
    const res = await fetch(`${getBaseUrl()}/api/bot/discord/login`, {
      method: "POST",
      headers: {
        "x-api-secret": getApiSecret(),
      },
    });
    if (res.status === 204) console.log("봇 로그인 성공");
    else console.log(`봇 로그인 실패: ${await res.text()}`);
  };
  await discordLogin();

  return <AuthClient />;
}
