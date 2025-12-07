import { redirect } from 'next/navigation';
import { handleApiRequest } from '@/app/api/apiWrapper';
import { DEPOSIT_ACC, DISCORD_INVITE_LINK, KAKAO_INVITE_LINK } from '@/util/constants';
import CopyButton from '@/components/CopyButton';
import styles from '../about.module.css';

export default async function WelcomePage() {
  const res = await handleApiRequest('GET', '/api/user/profile');
  if (!res.ok) {
    redirect('/us/login');
  }

  return (
    <>
      <div className={styles.wallLogo}></div>
      <div className={styles.wallLogo2}></div>
      <div className={styles.welcomeContainer}>
        <div className={styles.welcomeContent}>
          <div className={styles.contentBlock}>
            <h1>WELCOME!</h1>
            <h3 className={styles.noticeImportant}>
              회비를 입금해야 동아리 가입이 완료됩니다!
            </h3>
            <h3>
              <a
                href={DISCORD_INVITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.textLink}
              >
                디스코드 서버 링크
              </a>
              <CopyButton link={DISCORD_INVITE_LINK} />
            </h3>
            <h3>
              <a
                href={KAKAO_INVITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.textLink}
              >
                카카오톡 팀 채팅방
              </a>
              <CopyButton link={KAKAO_INVITE_LINK} />
            </h3>
            <h3>
              {DEPOSIT_ACC} <CopyButton link={DEPOSIT_ACC} />
            </h3>
            <h3>
              회비: <u>25000원</u> <br />
              입금자명 : <u>이름 + 전화번호 마지막 두자리</u> <br /> ex) 김창섭57
            </h3>
            <a href="/about/my-page" className={styles.textLink}>
              마이페이지로 이동
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
