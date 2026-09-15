import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import RefreshJWTClient from './RefreshJWTClient';
import HeroStage from './HeroStage';
import DigitalRain from './DigitalRain';
import TypedTagline from './TypedTagline';
import ScrollCue from './ScrollCue';
import JoinMenu from './JoinMenu';
import Reveal from './Reveal';
import { MainLogoImage } from '@/components/common/MainLogoImage';

const TAGLINES = [
  'Seoul National University Computer Study Club',
  '서울대학교 중앙컴퓨터연구회',
];

const ACTIVITIES = [
  {
    title: 'PS (SCPC)',
    description: '알고리즘 문제 해결. 교내 대회 SCPC를 직접 개최합니다.',
    image: '/about/activities/scpc.jpg',
  },
  {
    title: 'INIT',
    description: '프로젝트 중심의 팀 활동입니다.',
    image: '/about/activities/pig.jpg',
  },
  {
    title: '친목',
    description: 'MT, 번개 등 다양한 친목 도모 활동이 있습니다.',
    image: '/about/activities/mt.jpg',
  },
  {
    title: 'SKYST',
    description: '타 동아리와 연합한 해커톤 대회입니다.',
    image: '/about/activities/skyst.jpg',
  },
  {
    title: 'Etc.',
    description: '세미나, SIG 등 그 밖의 활동들입니다.',
    image: '/about/activities/seminar.jpg',
  },
];

export default function HomePage() {
  return (
    <>
      <RefreshJWTClient />

      <noscript>
        <style>{`.${styles.mainLogoWrap},.${styles.tagline},.${styles.scrollCue}{opacity:1}`}</style>
      </noscript>

      <HeroStage
        id="hero"
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

        <ScrollCue
          targetId="intro"
          className={styles.scrollCue}
          chevronClassName={styles.scrollCueChevron}
          aria-label="아래 내용으로 이동"
        />
      </HeroStage>

      <DigitalRain className={styles.rain} />

      <section id="intro" className={styles.intro}>
        <div className={styles.introInner}>
          <Reveal>
            <p className={styles.introLead}>
              <b>한글, 리니지, 아이온.</b>
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
            <p className={styles.introSubhead}>지금의 SCSC는</p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>
              <b>1984년부터 이어져 온 서울대학교 컴퓨터 연구회</b>로, 100~200여 명의 다양한
              전공을 가진 부원들이 <b>SIG</b>와 <b>PIG</b>로 모여 함께 공부하고 만듭니다. 현직
              개발자를 초청한 세미나, <b>SCPC</b> 알고리즘 대회, <b>SKYST</b> 해커톤까지 직접
              기획하고 운영합니다.
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>
              우리가 지향하는 것은 하나입니다. 앱 개발 및 웹 개발, 인공지능, 그리고 알고리즘까지
              어느 분야든
              <br />
              <b>각자가 자신만의 전문성을 갖출 수 있도록 돕는 것.</b>
            </p>
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
        </div>
      </section>

      <section id="join" className={styles.join}>
        <div className={styles.joinInner}>
          <div className={styles.joinLead}>
            <Reveal>
              <p className={styles.joinKicker}>SCSC와 함께 하시겠어요?</p>
            </Reveal>
            <Reveal>
              <p className={styles.joinHeadline}>
                개발자로 가는 가장 빠른 첫 걸음,
                <br />
                SCSC는 여러분을 기다리고 있습니다.
              </p>
            </Reveal>
            <Reveal>
              <Link href="/us/login" className={styles.joinCta}>
                가입하기
              </Link>
            </Reveal>
            <hr className={styles.joinRule} />
          </div>

          <JoinMenu />
        </div>
      </section>
    </>
  );
}
