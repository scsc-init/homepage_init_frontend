'use client';

import { useTranslations } from 'next-intl';

import { useEffect, useState } from 'react';
import { useMe } from '@/util/hooks/useMe';
import { getKvsClient } from '@/util/fetch/client-util';
import CopyButton from '@/components/CopyButton';
import styles from '../about.module.css';

export default function WelcomePage() {
  const t = useTranslations('Welcome');
  const rich = (key: string) =>
    t.rich(key, {
      strong: (chunks) => <strong>{chunks}</strong>,
      u: (chunks) => <u>{chunks}</u>,
      important: (chunks) => <span className={styles.noticeImportant}>{chunks}</span>,
      br: () => <br />,
    });
  const { me: profile, isLoading } = useMe();
  const [kvValues, setKvValues] = useState(['', '', '']);

  useEffect(() => {
    const fetchKvs = async () => {
      const values = await getKvsClient([
        'TEXT_DEPOSIT_ACC',
        'TEXT_KAKAO_INVITE_LINK',
        'TEXT_DISCORD_INVITE_LINK',
      ]);
      setKvValues(values);
    };
    fetchKvs();
  }, []);

  if (isLoading || !profile) return null;

  const [depositAcc, kakaoInviteLink, discordInviteLink] = kvValues;
  const isInactive = !profile || !profile.is_active;

  return (
    <main className={styles.welcomeContainer}>
      <div className={styles.welcomeContent}>
        <header className={styles.welcomeHeader}>
          <h1 className={styles.welcomeTitle}>{t('title')}</h1>

          <div className={styles.welcomeIntro}>
            <p>
              {profile.name
                ? t.rich('greetingNamed', {
                    name: profile.name,
                    nameTag: (chunks) => (
                      <span className={styles.noticeImportant}>{chunks}</span>
                    ),
                  })
                : t('greeting')}
            </p>
            <p className={styles.welcomeSubtitle}>{isInactive ? t('pending') : t('active')}</p>
          </div>
        </header>

        <div className={styles.stepsList}>
          <section className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepLabel}>STEP 1</span>
              <h2 className={styles.stepTitle}>{t('depositTitle')}</h2>
            </div>

            <p className={styles.stepBody}>{rich('depositInstructions')}</p>

            <dl className={styles.definitionList}>
              <div className={styles.definitionRow}>
                <dt>{t('feeLabel')}</dt>
                <dd>{t('feeAmount')}</dd>
              </div>
              <div className={styles.definitionRow}>
                <dt>{t('accountLabel')}</dt>
                <dd>
                  {depositAcc} <CopyButton link={depositAcc} label={t('copyAccount')} />
                </dd>
              </div>
            </dl>

            <p className={styles.smallNote}>{rich('depositorInstructions')}</p>
          </section>

          <section className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepLabel}>STEP 2</span>
              <h2 className={styles.stepTitle}>{t('kakaoTitle')}</h2>
            </div>

            <p className={styles.stepBody}>{rich('kakaoInstructions')}</p>

            <div className={styles.buttonsContainer}>
              <a
                href={kakaoInviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkButton}
              >
                {t('kakaoAction')}
              </a>
              <CopyButton link={kakaoInviteLink} label={t('copyLink')} />
            </div>

            <p className={styles.smallNote}>{rich('kakaoTip')}</p>
          </section>

          <section className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepLabel}>STEP 3</span>
              <h2 className={styles.stepTitle}>
                {t('discordAction')}
                <span className={styles.smallNote}>{t('optional')}</span>
              </h2>
            </div>

            <p className={styles.stepBody}>{rich('discordInstructions')}</p>

            <div className={styles.buttonsContainer}>
              <a
                href={discordInviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkButton}
              >
                {t('discordAction')}
              </a>
              <CopyButton link={discordInviteLink} label={t('copyLink')} />
            </div>
          </section>
          <section className={styles.statusCard}>
            <div className={styles.stepHeader}>
              <h2 className={styles.stepTitle}>{t('statusTitle')}</h2>
            </div>
            <p className={styles.stepBody}>{rich('statusInstructions')}</p>
            <div className={styles.buttonsContainer}>
              <a href="/about/my-page" className={styles.linkButton}>
                {t('statusAction')}
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
