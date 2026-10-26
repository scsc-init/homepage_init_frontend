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
    title: 'SCPC',
    description: '여러 기업들로부터 후원받는 PS대회 SCPC를 직접 개최합니다',
    image: '/about/activities/scpc.jpg',
  },
  {
    title: 'INIT',
    description: 'SCSC의 동아리 사이트를 개발하는 프로젝트 팀 활동입니다',
    image: '/about/activities/init.jpg',
  },
  {
    title: 'SKYSH',
    description: '타 학교 동아리들과 연합한 해커톤 대회입니다',
    image: '/about/activities/skysh.jpg',
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
        <span className={`${styles.heroGlow} no-theme-anim`} aria-hidden="true" />

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
            <p className={styles.introLead} data-jump-start="">
              <b>한글, 리니지, 아이온.</b>
              <br />
              이들의 공통점은 무엇일까요?
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>
              세계 최초의 한글 워드프로세서 <b>‘한글 1.0’</b>은
              <br />
              <b>제3회 SCSC 전시회</b>에서 처음 공개되었습니다.
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>
              <b>이찬진, 김형집, 우원식, 김택진</b> 선배님들을 비롯한 수많은 SCSC 선배님들이
              <br />
              다양한 기업을 창업하고, 대한민국의 소프트웨어와 게임 산업을 이끌어 왔습니다.
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introPunch}>
              이 모든 이야기의 시작에는 <b>SCSC</b>가 있었습니다.
            </p>
          </Reveal>

          <Reveal>
            <hr className={styles.introDivider} />
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>
              <b>지금의 SCSC는</b>
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody} data-jump-end="">
              <b>SKYSH</b> 해커톤 및 <b>SCPC</b> 알고리즘 대회를 개최하거나
              <br />
              현직 개발자분들을 초청해 세미나를 진행하는 등
              <br />
              다양한 행사를 기획 및 운영하고 있습니다.
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>
              <b>200여 명</b>의 다양한 전공을 가진 동아리원이 활동하고 있으며,
              <br />
              그런 만큼 SCSC는 <b>앱•웹•인공지능•알고리즘</b> 등 여러 분야에 걸쳐
              <br />
              자신만의 전문성을 가질 수 있도록 돕는 것을 주된 목표로 삼고 있습니다.
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introPunch}>
              <b>SCSC는 계속해서 나아갑니다!</b>
            </p>
          </Reveal>
        </div>
      </section>

      <section id="activities" className={styles.activities}>
        <div className={styles.sectionInner}>
          <Reveal>
            <h2 className={styles.sectionTitle}>대표 활동</h2>
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
            <p className={styles.activityNote}>
              이 밖에도 친목 모임을 비롯한 세미나와 외부 강연 및 행사,
              <br />
              그리고 다양한 분야의 SIG와 PIG, 크고 작은 소모임이 일 년 내내 이어집니다.
            </p>
          </Reveal>
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
