'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from '@/app/about/about.module.css';

type ScrollEffectWrapperProps = {
  children: ReactNode;
  variant?: 'fade';
};

export default function ScrollEffectWrapper({ children, variant }: ScrollEffectWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    });

    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  // `variant="fade"` does a gentle opacity-only fade (no upward "fly-up" motion).
  // Default keeps the original translateY fade used elsewhere on the about pages.
  const baseClass = variant === 'fade' ? styles.fadeIn : styles.fadeOnScroll;
  const visibleClass = variant === 'fade' ? styles.fadeInVisible : styles.fadeOnScrollVisible;

  return (
    <div className={`${baseClass} ${isVisible ? visibleClass : ''}`} ref={domRef}>
      {children}
    </div>
  );
}
