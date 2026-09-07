'use client';

import { useEffect, useState } from 'react';
import { useHeroIntroStarted } from './HeroStage';

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 2200;
const LINE_GAP_MS = TYPE_MS * 4;

export default function TypedTagline({ lines, className, cursorClassName, startDelay = 1250 }) {
  const started = useHeroIntroStarted();
  const [text, setText] = useState(lines[0]);
  const [revealed, setRevealed] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!started || lines.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }

    // 등장 자체를 타이핑으로 처리하므로, 시작 전까지는 빈 문자열로 둡니다.
    setText('');

    let timer;
    let lineIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const current = lines[lineIndex];

      if (!deleting && charIndex === current.length) {
        deleting = true;
        timer = setTimeout(tick, HOLD_MS);
        return;
      }

      if (deleting && charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
        timer = setTimeout(tick, LINE_GAP_MS);
        return;
      }

      charIndex += deleting ? -1 : 1;
      setText(current.slice(0, charIndex));
      timer = setTimeout(tick, deleting ? DELETE_MS : TYPE_MS);
    };

    const startTimer = setTimeout(() => {
      if (cancelled) return;
      setRevealed(true);
      setTyping(true);
      tick();
    }, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [started, lines, startDelay]);

  return (
    <p className={className} style={revealed ? { opacity: 1 } : undefined}>
      <span>{text}</span>
      {typing && (
        <span className={cursorClassName} aria-hidden="true">
          ▍
        </span>
      )}
    </p>
  );
}
