import { getTranslations } from 'next-intl/server';
// /app/about/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import ScrollEffectWrapper from './ScrollEffectWrapper';
import FaqList from './FaqList';
import Arrow from './Arrow';
import styles from './about.module.css';
import Sidebar from './Sidebar';
import { getKVValues } from '@/util/fetch/server-util';

export async function generateMetadata() {
  const t = await getTranslations('About');
  return { title: t('title') };
}

export default async function AboutPage() {
  const t = await getTranslations('About');
  const rich = (key: string) =>
    t.rich(key, {
      b: (chunks) => <b>{chunks}</b>,
      br: () => <br />,
    });

  const DEFAULT_DISCORD_INVITE_LINK = 'https://discord.gg/SmXFDxA7XE';
  const kv = await getKVValues(['TEXT_DISCORD_INVITE_LINK']);
  const inviteResult = kv['TEXT_DISCORD_INVITE_LINK'];
  const rawDiscordInviteLink = inviteResult?.status === 'fulfilled' ? inviteResult.value : '';
  const discordInviteLink = /^https?:\/\/\S+$/i.test(rawDiscordInviteLink)
    ? rawDiscordInviteLink
    : DEFAULT_DISCORD_INVITE_LINK;

  return (
    <>
      <div className="wallLogo"></div>
      <div className="wallLogo2"></div>
      <div className={styles.wrapper}>
        <Sidebar className={styles.sidebar} />
        <main className={styles.mainContent}>
          <ScrollEffectWrapper>
            <section id="scsc" className={`${styles.section} ${styles.anchorOffset}`}>
              <div className={styles.inner}>
                <h1 className={styles.title}>{t('title')}</h1>
                <div className={styles.mainIntro}>
                  <ScrollEffectWrapper>
                    <p>{rich('intro.question')}</p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>{rich('intro.club')}</p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>{rich('intro.hangul')}</p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>{rich('intro.companies')}</p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>{rich('intro.alumni')}</p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>{rich('intro.legacy')}</p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>{rich('intro.events')}</p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>{rich('intro.members')}</p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <h2>
                      <br />
                      <b>{t('intro.future')}</b>
                    </h2>
                  </ScrollEffectWrapper>
                </div>
              </div>
            </section>
          </ScrollEffectWrapper>

          <ScrollEffectWrapper variant="fade">
            <section id="activities" className={`${styles.section} ${styles.anchorOffset}`}>
              <div className={styles.inner}>
                <h2>{t('activitiesTitle')}</h2>
                <div className={styles.facilityList}>
                  {[
                    {
                      title: t('activities.seminar.title'),
                      description: t('activities.seminar.description'),
                      image: '/about/activities/seminar.jpg',
                    },
                    {
                      title: 'SIG',
                      description: t('activities.sig.description'),
                      image: '/about/activities/sig.jpg',
                    },
                    {
                      title: 'PIG',
                      description: t('activities.pig.description'),
                      image: '/about/activities/pig.jpg',
                    },
                    {
                      title: 'SCPC',
                      description: t('activities.scpc.description'),
                      image: '/about/activities/scpc.jpg',
                    },
                    {
                      title: 'SKYST',
                      description: t('activities.skyst.description'),
                      image: '/about/activities/skyst.jpg',
                    },
                    {
                      title: t('activities.social.title'),
                      description: t('activities.social.description'),
                      image: '/about/activities/mt.jpg',
                    },
                  ].map(({ title, description, image }) => (
                    <div
                      key={title}
                      className={`${styles.card} ${styles.cardHover} ${styles.facilityCard}`}
                    >
                      <div className={styles.imageWrapper} style={{ height: '200px' }}>
                        <Image src={image} alt={title} fill className={styles.image} />
                      </div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </ScrollEffectWrapper>

          <ScrollEffectWrapper variant="fade">
            <section id="faq" className={`${styles.section} ${styles.anchorOffset}`}>
              <div className={styles.inner}>
                <FaqList />
              </div>
            </section>
          </ScrollEffectWrapper>

          <ScrollEffectWrapper variant="fade">
            <section id="clubroom" className={`${styles.section} ${styles.anchorOffset}`}>
              <div className={styles.inner}>
                <div className={styles.clubroomContainer}>
                  <h2>{t('facilitiesTitle')}</h2>
                  <div className={styles.facilityList}>
                    {[
                      {
                        title: t('facilities.pc.title'),
                        description: t('facilities.pc.description'),
                        image: '/about/club-room/pc.jpg',
                      },
                      {
                        title: t('facilities.sofa.title'),
                        description: t('facilities.sofa.description'),
                        image: '/about/club-room/sofa.jpg',
                      },
                      {
                        title: t('facilities.refreshments.title'),
                        description: t('facilities.refreshments.description'),
                        image: '/about/club-room/refreshments.jpg',
                      },
                      {
                        title: t('facilities.books.title'),
                        description: t('facilities.books.description'),
                        image: '/about/club-room/books.jpg',
                      },
                      {
                        title: t('facilities.printer.title'),
                        description: t('facilities.printer.description'),
                        image: '/about/club-room/printer.jpg',
                      },
                      {
                        title: t('facilities.games.title'),
                        description: t('facilities.games.description'),
                        image: '/about/club-room/games.jpg',
                      },
                    ].map(({ title, description, image }) => (
                      <div
                        key={title}
                        className={`${styles.card} ${styles.cardHover} ${styles.facilityCard}`}
                      >
                        <div className={styles.imageWrapper} style={{ height: '200px' }}>
                          <Image src={image} alt={title} fill className={styles.image} />
                        </div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </ScrollEffectWrapper>

          <ScrollEffectWrapper variant="fade">
            <section id="more" className={`${styles.section} ${styles.anchorOffset}`}>
              <div className={styles.inner}>
                <div className={styles.card}>
                  <h2>{t('moreTitle')}</h2>
                  <div className={styles.linkList}>
                    {[
                      { title: t('links.recruiting'), url: '/us/contact' },
                      { title: t('links.sig'), url: '/sig' },
                      { title: t('links.pig'), url: '/pig' },
                      { title: t('links.discord'), url: discordInviteLink },
                      {
                        title: t('links.instagram'),
                        url: 'https://www.instagram.com/scsc_snu/?hl=ko',
                      },
                      {
                        title: t('links.github'),
                        url: 'https://github.com/SNU-SCSC',
                      },
                    ].map(({ title, url }, i) =>
                      url.startsWith('http') ? (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.link}
                        >
                          <span>{title}</span>
                          <Arrow
                            width="20px"
                            height="20px"
                            rotate="-90deg"
                            color="var(--foreground-color)"
                          />
                        </a>
                      ) : (
                        <Link key={i} href={url} className={styles.link}>
                          <span>{title}</span>
                          <Arrow
                            width="20px"
                            height="20px"
                            rotate="-90deg"
                            color="var(--foreground-color)"
                          />
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </section>
          </ScrollEffectWrapper>
        </main>
      </div>
    </>
  );
}
