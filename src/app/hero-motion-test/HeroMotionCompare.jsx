'use client';

import { useState } from 'react';
import HeroStage from '../HeroStage';
import TypedTagline from '../TypedTagline';
import { MainLogoImage } from '@/components/common/MainLogoImage';
import page from '../page.module.css';
import styles from './heroMotionTest.module.css';

const TAGLINES = ['Seoul National University Computer Study Club', '서울대학교 중앙컴퓨터연구'];

export default function HeroMotionCompare() {
  const [runId, setRunId] = useState(0);

  return (
    <div className={styles.root}>
      <header className={styles.bar}>
        <div className={styles.barText}>
          <strong>히어로 인트로 모션</strong>
          <span>임시 페이지입니다. 확인 후 /hero-motion-test 폴더를 삭제하세요.</span>
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            onClick={() => setRunId((n) => n + 1)}
            className={`${styles.button} ${styles.buttonActive}`}
          >
            ▶ 다시 재생
          </button>
        </div>
      </header>

      <div className={styles.caption}>
        <h2>로고 먼저 → 배경 → 타이핑</h2>
        <p>
          로고 1.9s(블러가 풀리며 맺힘) · 배경 도트 0.9s부터 1.5s · 타이핑 1.25s부터 · 스크롤
          화살표 2.6s
        </p>
      </div>

      <HeroStage
        key={runId}
        className={`${page.hero} ${styles.stage}`}
        overlayContainerClassName={page.overlayContainer}
        overlayClassName={page.overlay}
      >
        <div className={page.heroInner}>
          <div className={page.mainLogoWrap}>
            <MainLogoImage className={`${page.mainLogo} logo`} loading="eager" />
          </div>
          <TypedTagline
            lines={TAGLINES}
            className={page.tagline}
            cursorClassName={page.cursor}
          />
        </div>
        <span className={page.scrollCue} aria-hidden="true">
          <span className={page.scrollCueChevron} />
        </span>
      </HeroStage>
    </div>
  );
}
