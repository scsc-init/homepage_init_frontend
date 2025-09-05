import "./page.css";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";
import {
  DEPOSIT_ACC,
  DISCORD_INVITE_LINK,
  KAKAO_INVITE_LINK,
} from "@/util/constants";
import EnrollButton from "./EnrollButton";

async function fetchDiscordInviteLink() {
  const res = await fetch(
    `${getBaseUrl()}/api/bot/discord/general/get_invite`,
    {
      headers: { "x-api-secret": getApiSecret() },
      cache: "no-store",
    },
  );
  if (res.ok) {
    const resData = await res.json();
    return resData.result.invite_url;
  }
}

export default async function Contact() {
  return (
    <>
      <div className="WallLogo"></div>
      <div className="WallLogo2"></div>
      <div id="Home">
        <div id="HomeContent">
          <div className="ContentBlock">
            <h1>WELCOME!</h1>
            <h3>
              <a
                href={DISCORD_INVITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                디스코드 서버 링크
              </a>
            </h3>
            <h3>
              <a
                href={KAKAO_INVITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                카카오톡 팀 채팅방
              </a>
            </h3>
            <h3>{DEPOSIT_ACC}</h3>
            <h3>
              회비: 2.5만원 <br />
              입금자명 : 이름 + 전화번호 마지막 두자리 <br /> ex) 김창섭57
            </h3>
            <div className="EnrollCTA">
              <EnrollButton />
            </div>
            <a href="/about/my-page">마이페이지로 이동</a>
          </div>
        </div>
      </div>
    </>
  );
}
