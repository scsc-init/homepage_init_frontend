'use client';

import { useEffect, useState } from 'react';
import '@radix-ui/colors/red.css';
import '@radix-ui/colors/green.css';
import '@/styles/theme.css';
import { setRedirectAfterLogin } from '@/util/loginRedirect';
import styles from './page.module.css';
import CopyButton from '@/components/CopyButton';
import InAppBrowserOutButton from '@/components/InAppBrowserOutButton';
import { useTranslations } from 'next-intl';

type InAppBrowserProps = { initialRedirect?: string | null; slug?: string[] };
const IN_APP_BROWSER_KEYS = ['kakaotalk', 'everytime', 'instagram', 'line'];

export default function InAppBrowser({ initialRedirect = null, slug = [] }: InAppBrowserProps) {
  const [inAppWarning, setInAppWarning] = useState(false);
  const t = useTranslations('InAppBrowser');
  const [inAppBrowserKey, setInAppBrowserKey] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!initialRedirect) return;
    setRedirectAfterLogin(initialRedirect);
  }, [initialRedirect]);

  useEffect(() => {
    setMounted(true);

    const ua = navigator.userAgent.toLowerCase();

    if (slug?.length > 0) {
      const key = slug[0];
      if (IN_APP_BROWSER_KEYS.includes(key)) {
        setInAppWarning(true);
        setInAppBrowserKey(key);
        return;
      }
    }

    for (const key of IN_APP_BROWSER_KEYS) {
      if (ua.includes(key)) {
        setInAppWarning(true);
        setInAppBrowserKey(key);
        return;
      }
    }

    setInAppWarning(true);
    setInAppBrowserKey('inApp');
  }, [slug]);

  return (
    mounted &&
    inAppWarning && (
      <div className={styles['page-container']}>
        <div className={styles['warning-wrapper']}>
          <h1 style={{ marginBottom: 0 }}>
            {t.rich('titleBrowser', {
              browser: t(`browserNames.${inAppBrowserKey}`),
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </h1>
          <h1 style={{ marginTop: 0, marginBottom: '10px' }}>
            {t.rich('titleLogin', { strong: (chunks) => <strong>{chunks}</strong> })}
          </h1>
          <h3 style={{ marginBottom: '20px' }}>
            {t.rich('guide', { strong: (chunks) => <strong>{chunks}</strong> })}
          </h3>
        </div>

        <div className={styles['copy-button-wrapper']}>
          <CopyButton link="scsc.dev" label={t('copyLink')} />
        </div>

        <div className={styles['copy-button-wrapper']}>
          <InAppBrowserOutButton redirectTo={initialRedirect} />
        </div>
      </div>
    )
  );
}
