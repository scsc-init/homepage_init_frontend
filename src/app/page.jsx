import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import RefreshJWTClient from './RefreshJWTClient';
import HeroStage from './HeroStage';
import TypedTagline from './TypedTagline';
import Reveal from './Reveal';
import { MainLogoImage } from '@/components/common/MainLogoImage';
import { SEMESTER_MAP } from '@/util/constants';
import { fetchGlobalStatus, getKVValues } from '@/util/fetch/server-util';

const DEFAULT_DISCORD_INVITE_LINK = 'https://discord.gg/SmXFDxA7XE';

const TAGLINES = ['Seoul National University Computer Study Club', '서울대학교 중앙컴퓨터연구'];

/**
 * 메인 페이지에 요약해 싣는 활동들입니다.
 * 각 활동의 자세한 설명은 /about#activities 에 있습니다.
 */
const ACTIVITIES = [
  {
    title: '세미나',
    description: '외부 기업인 또는 동아리원이 컴퓨터와 관련된 주제로 세미나를 개최합니다.',
    image: '/about/activities/seminar.jpg',
  },
  {
    title: 'SIG',
    description: '특정 주제에 관심이 있는 동아리원이 모여 함께 공부하는 모임입니다.',
    image: '/about/activities/sig.jpg',
  },
  {
    title: 'PIG',
    description: '프로젝트 중심의 팀 활동입니다. INIT 등이 있습니다.',
    image: '/about/activities/pig.jpg',
  },
  {
    title: 'SCPC',
    description: '알고리즘 대회입니다.',
    image: '/about/activities/scpc.jpg',
  },
  {
    title: 'SKYST',
    description: '타 동아리와 연합한 해커톤 대회입니다.',
    image: '/about/activities/skyst.jpg',
  },
  {
    title: '친목 활동',
    description: 'MT, 번개 등 다양한 친목 도모 활동이 있습니다.',
    image: '/about/activities/mt.jpg',
  },
];

export default async function HomePage() {
  // getKVValues는 내부에서 실패를 흡수하므로 allSettled가 필요 없습니다.
  const [[statusResult], kv] = await Promise.all([
    Promise.allSettled([fetchGlobalStatus()]),
    getKVValues(['TEXT_DISCORD_INVITE_LINK']),
  ]);

  const globalStatus = statusResult.status === 'fulfilled' ? statusResult.value : null;
  const isRecruiting = globalStatus?.status === 'recruiting';
  const termLabel =
    globalStatus?.year && globalStatus?.semester
      ? `${globalStatus.year}-${SEMESTER_MAP[globalStatus.semester] ?? globalStatus.semester}학기 `
      : '';

  const inviteResult = kv['TEXT_DISCORD_INVITE_LINK'];
  const rawDiscordInviteLink = inviteResult?.status === 'fulfilled' ? inviteResult.value : '';
  const discordInviteLink = /^https?:\/\/\S+$/i.test(rawDiscordInviteLink)
    ? rawDiscordInviteLink
    : DEFAULT_DISCORD_INVITE_LINK;

  const joinLinks = [
    { title: '리크루팅 정보', url: '/us/contact', primary: true },
    { title: 'Discord', url: discordInviteLink },
    { title: 'Instagram', url: 'https://www.instagram.com/scsc_snu/?hl=ko' },
    { title: 'GitHub', url: 'https://github.com/SNU-SCSC' },
  ];

  return (
    <>
      <RefreshJWTClient />

      <noscript>
        <style>{`.${styles.mainLogoWrap},.${styles.tagline},.${styles.scrollCue}{opacity:1}`}</style>
      </noscript>

      <HeroStage
        className={styles.hero}
        overlayContainerClassName={styles.overlayContainer}
        overlayClassName={styles.overlay}
      >
        <div className={styles.heroInner}>
          <div className={styles.mainLogoWrap}>
            <MainLogoImage className={`${styles.mainLogo} logo`} loading="eager" />
          </div>

          <TypedTagline
            lines={TAGLINES}
            className={styles.tagline}
            cursorClassName={styles.cursor}
          />
        </div>

        <a href="#intro" className={styles.scrollCue} aria-label="아래 내용으로 이동">
          <span className={styles.scrollCueChevron} aria-hidden="true" />
        </a>
      </HeroStage>

      <section id="intro" className={styles.intro}>
        <div className={styles.introInner}>
          <Reveal>
            <p className={styles.introLead}>
              <b>한글, 리니지, 리니지2, 아이온.</b>
              <br />
              이들의 공통점은 무엇일까요?
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>
              세계 최초의 한글 워드프로세서 <b>‘한글 1.0’</b>은 <b>제3회 SCSC 전시회</b>에서
              처음 공개되었습니다. <b>이찬진, 김형집, 우원식, 김택진</b> 선배님들은 우리나라
              소프트웨어 역사의 주역이셨습니다.
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introPunch}>
              이 모든 것은 <b>SCSC 없이는 불가능했을</b> 이야기입니다.
            </p>
          </Reveal>

          <Reveal>
            <hr className={styles.introDivider} />
          </Reveal>

          <Reveal>
            <p className={styles.introSubhead}>그리고 지금의 SCSC는</p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>
              <b>1984년부터 이어져 온 서울대학교 컴퓨터 연구회</b>로, 200여 명의 다양한 전공을
              가진 부원들이 <b>SIG</b>와 <b>PIG</b>로 모여 함께 공부하고 만듭니다. 현직 개발자를
              초청한 세미나, <b>SCPC</b> 알고리즘 대회, <b>SKYST</b> 해커톤까지 직접 기획하고
              운영합니다.
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>
              우리가 지향하는 것은 하나입니다. 앱·웹·인공지능·알고리즘 어느 분야든,
              <br />
              <b>각자가 자신만의 전문성을 갖출 수 있도록 돕는 것.</b>
            </p>
          </Reveal>

          <Reveal>
            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt>설립</dt>
                <dd>1984</dd>
              </div>
              <div className={styles.stat}>
                <dt>동아리원</dt>
                <dd>200+</dd>
              </div>
              <div className={styles.stat}>
                <dt>분야</dt>
                <dd>앱 · 웹 · AI · 알고리즘</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal>
            <Link href="/about" className={styles.textLink}>
              SCSC의 역사 더 보기 <span aria-hidden="true">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="activities" className={styles.activities}>
        <div className={styles.sectionInner}>
          <Reveal>
            <h2 className={styles.sectionTitle}>이런 활동을 합니다</h2>
          </Reveal>

          <div className={styles.activityGrid}>
            {ACTIVITIES.map(({ title, description, image }) => (
              <Reveal key={title}>
                <article className={styles.activityCard}>
                  <div className={styles.activityImage}>
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 340px"
                      className={styles.activityImageInner}
                    />
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <Link href="/about" className={styles.textLink}>
              활동 자세히 보기 <span aria-hidden="true">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="join" className={styles.join}>
        <div className={styles.joinInner}>
          <Reveal>
            <h2 className={styles.joinTitle}>SCSC와 함께하시겠어요?</h2>
          </Reveal>

          <Reveal>
            <p className={styles.joinSubtitle}>
              {isRecruiting
                ? `${termLabel}신입 부원을 모집하고 있습니다.`
                : '전공과 학년에 관계없이, 컴퓨터가 좋다면 누구든 환영합니다.'}
            </p>
          </Reveal>

          <Reveal>
            <div className={styles.joinLinks}>
              {joinLinks.map(({ title, url, primary }) => {
                const cls = `${styles.joinLink} ${primary ? styles.joinLinkPrimary : ''}`;
                return url.startsWith('http') ? (
                  <a
                    key={title}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {title}
                  </a>
                ) : (
                  <Link key={title} href={url} className={cls}>
                    {title}
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
