'use client';

import { useRef } from 'react';
import { useMe } from '@/util/hooks/useMe';
import styles from './page.module.css';

export default function JoinButton() {
  const { me, isLoading } = useMe();
  const ref = useRef();

  const handleMouseEnter = (e) => {
    const btn = ref.current;
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
        <p className={styles.joinDescription}>
          SCSC에 관심이 있으신가요? 아래 버튼을 눌러 가입 신청서를 작성해주세요.
        </p>
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
      <p className={styles.joinDescription}>
        입금 안내, 카카오톡/디스코드 참여 링크는 환영 페이지에서 확인할 수 있습니다.
      </p>
      <a
        href="/about/welcome"
        className={styles.joinButton}
        ref={ref}
        onMouseEnter={handleMouseEnter}
      >
        환영 페이지로 이동
      </a>
    </div>
  );
}
