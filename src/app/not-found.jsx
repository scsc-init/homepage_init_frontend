'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './Not-found.module.css';

export default function NotFound() {
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflowY;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflowY = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflowY = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <main className={styles.NF_Root}>
      <div className={styles.NF_Backdrop} aria-hidden="true" />
      <section className={styles.NF_Card} role="group" aria-labelledby="nf-title">
        <div className={styles.NF_Badge} aria-hidden="true">
          404
        </div>
        <h1 id="nf-title" className={styles.NF_Title}>
          페이지를 찾을 수 없습니다
        </h1>
        <p className={styles.NF_Desc}>요청하신 주소가 변경되었거나 존재하지 않습니다.</p>
        <div className={styles.NF_Actions}>
          <button className={`${styles.NF_Button} ${styles.NF_Secondary}`} onClick={goBack}>
            ← 뒤로가기
          </button>
          <Link className={styles.NF_Button} href="/" prefetch>
            홈으로 이동
          </Link>
        </div>
      </section>
    </main>
  );
}
