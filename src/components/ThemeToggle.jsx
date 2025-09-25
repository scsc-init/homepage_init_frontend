'use client';

import { useEffect, useState } from 'react';
import '@/styles/theme.css';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.split('; ').find((r) => r.startsWith(name + '='));
  return m ? decodeURIComponent(m.split('=')[1]) : null;
}

function setCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export default function ThemeToggle({ initialDark }) {
  const [dark, setDark] = useState(typeof initialDark === 'boolean' ? initialDark : true);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setCookie('theme', next ? 'dark' : 'light');
    const html = document.documentElement;
    html.classList.add('theme-animating');
    requestAnimationFrame(() => {
      html.classList.toggle('dark', next);
      setDark(next);
      const dur = getComputedStyle(html).getPropertyValue('--theme-anim-duration') || '180ms';
      const ms = parseFloat(dur) || 180;
      setTimeout(() => {
        html.classList.remove('theme-animating');
      }, ms + 50);
    });
  };

  return (
    <button className="ThemeToggle" onClick={toggleTheme} aria-label="Toggle dark mode">
      <span suppressHydrationWarning>{dark ? '🌙' : '☀️'}</span>
    </button>
  );
}
