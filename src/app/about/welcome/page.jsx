import "./page.css";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";
import { DEPOSIT_ACC, DISCORD_INVITE_LINK } from "@/util/constants";
import EnrollButton from "./EnrollButton"

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

export default async function Contact() {
  // const discordInviteLink = await fetchDiscordInviteLink();

  return (
    <>
      <div className="WallLogo"></div>
      <div className="WallLogo2"></div>
      <div id="Home">
        <div id="HomeContent">
          <div className="ContentBlock">
            <h1>WELCOME!</h1>
            {/* <p>등록되었습니다. 이제 다음 과정을 거쳐 가입을 완료해주세요.</p>
            <h2>1. 디스코드 서버 가입</h2>
            <p>동아리 공식 디스코드 서버에 가입하셔야 정상적으로 동아리 활동이 가능합니다. <a href={discordInviteLink} target="_blank" rel="noopener noreferrer">이 링크</a>를 통해 가입해주세요.</p>
            <h2>2. 회비 납부</h2>
            <p>SCSC는 한 학기 단위로 회비를 받고 있습니다. 회비 납부가 확인된 후 그 학기 동안 회원으로서 활동 가능합니다.</p>
            <p>입금 계좌는 [ {DEPOSIT_ACC} ]이며, 회비는 2.5만원입니다. 입금 후에는 <a href='/about/my-page' target="_blank" rel="noopener noreferrer">마이페이지</a>에서 입금 등록을 완료해주세요. 입금 확인이 임원진에 의해 완료되기까지 시간이 다소 걸릴 수 있습니다.</p>
            <p>자세한 설명은 <a href={discordInviteLink} target="_blank" rel="noopener noreferrer">디스코드 서버</a>에서 확인할 수 있습니다.</p>
            <hr></hr>
            수고하셨습니다. 가입이 완료되었습니다. SCSC에 온 걸 진심으로 환영합니다! */}
            <h3><a href={DISCORD_INVITE_LINK} target="_blank" rel="noopener noreferrer">디스코드 서버 링크</a></h3>
            <h3>{DEPOSIT_ACC}</h3>
            <div className="deposit-container">
              <h3>회비: 2.5만원</h3>
              <EnrollButton/>
            </div>
            <a href='/about/my-page'>마이페이지로 이동</a>
          </div>
        </div>
      </div>
    </>
  );
}
