import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
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

const ACTIVITIES = [
  {
    title: 'SCPC',
    description: 'scpc',
    image: '/about/activities/scpc.jpg',
  },
  {
    title: 'INIT',
    description: 'init',
    image: '/about/activities/init.jpg',
  },
  {
    title: 'SKYSH',
    description: 'skysh',
    image: '/about/activities/skysh.jpg',
  },
];

const richText = {
  b: (chunks: ReactNode) => <b>{chunks}</b>,
  br: () => <br />,
};

export default async function HomePage() {
  const t = await getTranslations('Home');
  const taglines = ['Seoul National University Computer Study Club', t('clubName')];
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
            lines={taglines}
            className={styles.tagline}
            cursorClassName={styles.cursor}
          />
        </div>

        <ScrollCue
          targetId="intro"
          className={styles.scrollCue}
          chevronClassName={styles.scrollCueChevron}
          aria-label={t('scroll')}
        />
      </HeroStage>

      <DigitalRain className={styles.rain} />

      <section id="intro" className={styles.intro}>
        <div className={styles.introInner}>
          <Reveal>
            <p className={styles.introLead} data-jump-start="">
              {t.rich('question', richText)}
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>{t.rich('hangul', richText)}</p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>{t.rich('alumni', richText)}</p>
          </Reveal>

          <Reveal>
            <p className={styles.introPunch}>{t.rich('origin', richText)}</p>
          </Reveal>

          <Reveal>
            <hr className={styles.introDivider} />
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>{t.rich('today', richText)}</p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody} data-jump-end="">
              {t.rich('events', richText)}
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.introBody}>{t.rich('members', richText)}</p>
          </Reveal>

          <Reveal>
            <p className={styles.introPunch}>{t.rich('onward', richText)}</p>
          </Reveal>
        </div>
      </section>

      <section id="activities" className={styles.activities}>
        <div className={styles.sectionInner}>
          <Reveal>
            <h2 className={styles.sectionTitle}>{t('activities')}</h2>
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
                  <p>{t(description)}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className={styles.activityNote}>{t.rich('activityNote', richText)}</p>
          </Reveal>
        </div>
      </section>

      <section id="join" className={styles.join}>
        <div className={styles.joinInner}>
          <div className={styles.joinLead}>
            <Reveal>
              <p className={styles.joinKicker}>{t('joinKicker')}</p>
            </Reveal>
            <Reveal>
              <p className={styles.joinHeadline}>{t.rich('joinHeadline', richText)}</p>
            </Reveal>
            <Reveal>
              <Link href="/us/login" className={styles.joinCta}>
                {t('join')}
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
