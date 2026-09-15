'use client';

import { useEffect, useRef } from 'react';
import { beginButtonRun, cancelButtonRun, easeInOutCubic } from './transitionPace';

const DESCENT_SPEED = 580; // px/s
const MIN_DURATION = 1000;
const MAX_DURATION = 2100;

const setScrollTop = (value) => {
  document.documentElement.scrollTop = value;
  document.body.scrollTop = value;
};

const getScrollTop = () =>
  Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
  );

const maxScrollTop = () =>
  Math.max(
    0,
    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) -
      window.innerHeight,
  );

const layoutTop = (el) => {
  let y = 0;
  for (let node = el; node; node = node.offsetParent) y += node.offsetTop;
  return y;
};

const frameEnd = (target, start, margin) => {
  const first = target.querySelector('[data-jump-start]');
  const last = target.querySelector('[data-jump-end]');
  if (!first || !last) return start + target.getBoundingClientRect().top - margin;

  const top = layoutTop(first);
  const bottom = layoutTop(last) + last.offsetHeight;
  const slack = Math.max(0, window.innerHeight - margin - (bottom - top));
  return top - margin - slack / 2;
};

export default function ScrollCue({
  targetId,
  className,
  chevronClassName,
  children,
  ...rest
}) {
  const rafRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const handleClick = (event) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();

    const start = getScrollTop();
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const end = Math.max(0, Math.min(frameEnd(target, start, margin), maxScrollTop()));
    const distance = end - start;

    if (
      Math.abs(distance) < 2 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setScrollTop(end);
      return;
    }

    const duration = Math.min(
      MAX_DURATION,
      Math.max(MIN_DURATION, (Math.abs(distance) / DESCENT_SPEED) * 1000),
    );
    beginButtonRun(start, end, duration);
    const began = performance.now();

    const scrollHosts = [document.documentElement, document.body];
    const previousBehaviors = scrollHosts.map((el) => el.style.scrollBehavior);
    scrollHosts.forEach((el) => {
      el.style.scrollBehavior = 'auto';
    });

    const stop = (aborted) => {
      cancelAnimationFrame(rafRef.current);
      scrollHosts.forEach((el, i) => {
        el.style.scrollBehavior = previousBehaviors[i];
      });
      window.removeEventListener('wheel', onUserScroll);
      window.removeEventListener('touchstart', onUserScroll);
      if (aborted) cancelButtonRun();
    };

    function onUserScroll(event) {
      if (performance.now() - began < 140) return;
      if (event.type === 'wheel' && Math.abs(event.deltaY) < 4) return;
      stop(true);
    }
    window.addEventListener('wheel', onUserScroll, { passive: true });
    window.addEventListener('touchstart', onUserScroll, { passive: true });

    const tick = (time) => {
      const t = Math.min(1, (time - began) / duration);
      setScrollTop(start + distance * easeInOutCubic(t));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else stop(false);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <a href={`#${targetId}`} className={className} onClick={handleClick} {...rest}>
      {children ?? <span className={chevronClassName} aria-hidden="true" />}
    </a>
  );
}
