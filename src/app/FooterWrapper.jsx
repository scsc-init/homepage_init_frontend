import "./footer.css";
import Footer from "./Footer";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

async function fetchDiscordInviteLink() {
  const res = await fetch(`${getBaseUrl()}/api/bot/discord/general/get_invite`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (res.ok) {
    const resData = await res.json();
    return resData.result.invite_url;
  }
}

export default async function FooterWrapper() {
  const discordInviteLink = await fetchDiscordInviteLink();

  return <Footer discordInviteLink={discordInviteLink}/>;
}
