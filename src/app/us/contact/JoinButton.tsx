'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import type { MouseEvent } from 'react';
import { useMe } from '@/util/hooks/useMe';
import styles from './page.module.css';

export default function JoinButton() {
  const { me, isLoading } = useMe();
  const t = useTranslations('UsContact');
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    const btn = ref.current;

    if (!btn) return;

    const ripple = document.createElement('span');
    ripple.className = styles.ripple;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);

    setTimeout(() => ripple.remove(), 800);
  };

  if (isLoading) return null;

  if (!me) {
    return (
      <div className={`${styles.activityBlock} ${styles.fadeInBlock} ${styles.joinUsSection}`}>
        <div className={styles.sectionHeader}>JOIN US:</div>

        <p className={styles.joinDescription}>{t('joinDescription')}</p>

        <a
          href="/us/login"
          className={styles.joinButton}
          ref={ref}
          onMouseEnter={handleMouseEnter}
        >
          Join us!
        </a>
      </div>
    );
  }

  return (
    <div className={`${styles.activityBlock} ${styles.fadeInBlock} ${styles.joinUsSection}`}>
      <div className={styles.sectionHeader}>WELCOME:</div>

      <p className={styles.joinDescription}>{t('welcomeDescription')}</p>

      <a
        href="/about/welcome"
        className={styles.joinButton}
        ref={ref}
        onMouseEnter={handleMouseEnter}
      >
        {t('welcomeLink')}
      </a>
    </div>
  );
}
