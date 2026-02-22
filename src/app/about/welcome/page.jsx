import { redirect } from 'next/navigation';
import { handleApiRequest } from '@/app/api/apiWrapper';
import { DEPOSIT_ACC, DISCORD_INVITE_LINK, KAKAO_INVITE_LINK } from '@/util/constants';
import CopyButton from '@/components/CopyButton';
import styles from '../about.module.css';

const PENDING_STATUSES = new Set(['pending', 'standby']);

const WELCOME_LOGIN_PATH = '/about/welcome';

export default async function WelcomePage() {
  const res = await handleApiRequest('GET', '/api/user/profile');

  if (!res.ok) {
    redirect(`/us/login?redirect=${encodeURIComponent(WELCOME_LOGIN_PATH)}`);
  }

  const profile = await res.json();

  const enrollmentStatus =
    profile?.enroll_status ?? profile?.status ?? profile?.membership_status ?? '';
  const isPendingStatus = PENDING_STATUSES.has(enrollmentStatus);

  return (
    <main className={styles.welcomeContainer}>
      <div className={styles.welcomeContent}>
        <header className={styles.welcomeHeader}>
          <h1 className={styles.welcomeTitle}>가입 안내</h1>

          <div className={styles.welcomeIntro}>
            <p>
              {profile?.name ? (
                <>
                  <span className={styles.noticeImportant}>{profile.name}님</span>, 환영합니다!
                </>
              ) : (
                '환영합니다!'
              )}
            </p>
            <p className={styles.welcomeSubtitle}>
              {isPendingStatus
                ? '가입 신청이 접수되었어요. 아래 STEP 1–3 순서대로 진행해주세요.'
                : '등록이 완료되었습니다! 아래 STEP 2–3 순서대로 진행해주세요.'}
            </p>
          </div>
        </header>

        <div className={styles.stepsList}>
          <section className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepLabel}>STEP 1</span>
              <h2 className={styles.stepTitle}>가입비 입금</h2>
            </div>

            <p className={styles.stepBody}>
              가입을 완료하려면 아래 계좌로
              <strong> 가입비</strong>를 입금해 주세요.
            </p>

            <dl className={styles.definitionList}>
              <div className={styles.definitionRow}>
                <dt>가입비</dt>
                <dd>25,000원</dd>
              </div>
              <div className={styles.definitionRow}>
                <dt>입금 계좌</dt>
                <dd>
                  {DEPOSIT_ACC} <CopyButton link={DEPOSIT_ACC} label="계좌번호 복사" />
                </dd>
              </div>
            </dl>

            <p className={styles.smallNote}>
              <strong>입금자명</strong>은 <u>이름 + 전화번호 마지막 두 자리</u>로 입력해 주세요.
              <br />
              예시) 김창섭57
            </p>
          </section>

          <section className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepLabel}>STEP 2</span>
              <h2 className={styles.stepTitle}>카카오톡 팀 채팅방 가입</h2>
            </div>

            <p className={styles.stepBody}>
              가입비 입금 확인과 공지 전달을 위해{' '}
              <span className={styles.noticeImportant}>카카오톡 팀 채팅방 입장은 필수</span>
              입니다.
            </p>

            <div className={styles.buttonsContainer}>
              <a
                href={KAKAO_INVITE_LINK}
                target="_blank"
                rel="noreferrer"
                className={styles.chatButton}
              >
                카카오톡 팀 채팅방 입장
              </a>
              <CopyButton link={KAKAO_INVITE_LINK} label="링크 복사" />
            </div>

            <p className={styles.smallNote}>
              TIP. 입금 <strong>직후</strong> 바로 입장 신청을 해주시면 확인이 더 빠릅니다.
            </p>
          </section>

          <section className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepLabel}>STEP 3</span>
              <h2 className={styles.stepTitle}>디스코드 서버 입장(선택)</h2>
            </div>

            <p className={styles.stepBody}>
              원활한 동아리 활동을 위해 아래 서버에 입장해{' '}
              <strong>
                <span className={styles.noticeImportant}>/enroll</span>
              </strong>{' '}
              명령어를 입력해주세요.
            </p>

            <div className={styles.buttonsContainer}>
              <a
                href={DISCORD_INVITE_LINK}
                target="_blank"
                rel="noreferrer"
                className={styles.chatButton}
              >
                디스코드 서버 입장
              </a>
              <CopyButton link={DISCORD_INVITE_LINK} label="링크 복사" />
            </div>
          </section>
          <section className={styles.statusCard}>
            <div className={styles.stepHeader}>
              <h2 className={styles.stepTitle}>가입 상태 확인</h2>
            </div>
            <p className={styles.stepBody}>
              입금 확인과 가입 승인 상태는 <strong>마이페이지</strong>에서 확인할 수 있어요.
            </p>
            <div className={styles.buttonsContainer}>
              <a href="/about/my-page" className={styles.actionButton}>
                마이페이지 열기
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
