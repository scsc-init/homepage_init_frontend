'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ShimmerOverlay from './ShimmerOverlay';

const OVERLAYS = [
  { src: '/main/logo-overlay-left.png', width: 1490, height: 1094 },
  { src: '/main/logo-overlay-right.png', width: 1454, height: 1094 },
];

// 도트 추출이 실패하거나 지나치게 느릴 때도 인트로가 시작되도록 하는 한계 시간
const START_TIMEOUT_MS = 1500;

const HeroIntroContext = createContext(false);

/** 히어로 인트로가 시작되었는지 알려줍니다. 자식 컴포넌트가 등장 시점을 맞출 때 씁니다. */
export function useHeroIntroStarted() {
  return useContext(HeroIntroContext);
}

export default function HeroStage({
  className,
  overlayContainerClassName,
  overlayClassName,
  children,
}) {
  const [started, setStarted] = useState(false);
  const readyCount = useRef(0);

  const handleReady = useCallback(() => {
    readyCount.current += 1;
    if (readyCount.current >= OVERLAYS.length) setStarted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), START_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={className} data-intro={started ? '' : undefined}>
      <div className={overlayContainerClassName} aria-hidden="true">
        {OVERLAYS.map(({ src, width, height }) => (
          <ShimmerOverlay
            key={src}
            className={overlayClassName}
            src={src}
            width={width}
            height={height}
            onReady={handleReady}
          />
        ))}
      </div>
      <HeroIntroContext.Provider value={started}>{children}</HeroIntroContext.Provider>
    </section>
  );
}
