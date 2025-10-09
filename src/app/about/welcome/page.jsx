import './page.css';
import EnrollButton from './EnrollButton';
import { redirect } from 'next/navigation';
import { handleApiRequest } from '@/app/api/apiWrapper';
import { DEPOSIT_ACC, DISCORD_INVITE_LINK, KAKAO_INVITE_LINK } from '@/util/constants';
import CopyButton from '@/components/CopyButton';

export default async function WelcomePage() {
  const res = await handleApiRequest('GET', '/api/user/profile');
  if (!res.ok) {
    redirect('/us/login');
  }

  return (
    <>
      <div className="WallLogo"></div>
      <div className="WallLogo2"></div>
      <div id="Home">
        <div id="HomeContent">
          <div className="ContentBlock">
            <h1>WELCOME!</h1>
            <h3>
              <a href={DISCORD_INVITE_LINK} target="_blank" rel="noopener noreferrer">
                디스코드 서버 링크
              </a>
              <CopyButton link={DISCORD_INVITE_LINK} />
            </h3>
            <h3>
              <a href={KAKAO_INVITE_LINK} target="_blank" rel="noopener noreferrer">
                카카오톡 팀 채팅방
              </a>
              <CopyButton link={KAKAO_INVITE_LINK} />
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
