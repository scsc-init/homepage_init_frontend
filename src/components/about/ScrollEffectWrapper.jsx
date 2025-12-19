'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/app/about/about.module.css';

export default function ScrollEffectWrapper({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

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

  return (
    <div
      className={`${styles.fadeOnScroll} ${isVisible ? styles.fadeOnScrollVisible : ''}`}
      ref={domRef}
    >
      {children}
    </div>
  );
}
