'use client';

import { useEffect, useRef, useState } from 'react';
import '@/styles/theme.css';
import styles from './ThemeToggle.module.css';

function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  const secure =
    typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

type ThemeToggleProps = {
  initialDark?: boolean;
};

export default function ThemeToggle({ initialDark }: ThemeToggleProps) {
  const [dark, setDark] = useState(typeof initialDark === 'boolean' ? initialDark : true);
  const animTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  useEffect(() => () => clearTimeout(animTimer.current), []);

  const toggleTheme = () => {
    const next = !dark;
    setCookie('theme', next ? 'dark' : 'light');
    const html = document.documentElement;
    clearTimeout(animTimer.current);
    html.classList.add('theme-animating');
    requestAnimationFrame(() => {
      html.classList.toggle('dark', next);
      setDark(next);
      const raw = getComputedStyle(html).getPropertyValue('--theme-anim-duration').trim();
      const value = parseFloat(raw) || 0;
      const ms = raw.endsWith('ms') ? value : value * 1000;
      animTimer.current = setTimeout(() => {
        html.classList.remove('theme-animating');
        animTimer.current = undefined;
      }, ms + 50);
    });
  };

  return (
    <button className={styles.ThemeToggle} onClick={toggleTheme} aria-label="Toggle dark mode">
      <span suppressHydrationWarning>{dark ? '🌙' : '☀️'}</span>
    </button>
  );
}
