'use client';

import { useEffect, useState } from 'react';
import { scrollToId } from './ScrollToID';
import styles from '@/app/about/about.module.css';

export default function ClientSidebar({ className }) {
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const lastSection = sections[sections.length - 1];

    let currentSectionElement = null;
    let track = null;
    let activePortion = null;
    let target = null;
    let currentHandler = null;

    const getScroller = () => {
      if (document.documentElement.scrollTop > 0) return document.documentElement;
      if (document.body.scrollTop > 0) return document.body;
      return document.documentElement;
    };

    const handleScrollGen = (scroller) => () => {
      if (!currentSectionElement || !activePortion) return;

      const scrollerRect = scroller.getBoundingClientRect();
      const sectionRect = currentSectionElement.getBoundingClientRect();

      const absoluteSectionTop = sectionRect.top - scrollerRect.top + scroller.scrollTop;
      const currentScroll = scroller.scrollTop;
      const sectionHeight = currentSectionElement.offsetHeight;

      const distanceIntoSection = currentScroll - absoluteSectionTop;

      // Normalized Math: 0 to 100
      let p = (distanceIntoSection / sectionHeight) * 100;

      if (p < 0) p = 0;
      if (p > 100) p = 100;

      activePortion.style.height = p + '%';
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const scroller = getScroller();

            if (target) {
              target.classList.remove(styles.activeSectionNav);
              setIsEnd(false);
            }

            if (target && track && activePortion) {
              if (target.contains(track)) target.removeChild(track);
              scroller.removeEventListener('scroll', currentHandler);
              track = null;
              activePortion = null;
            }

            if (entry.target === lastSection) {
              target = document.querySelector(`a[href="#${entry.target.id}"]`);
              target.classList.add(styles.activeSectionNav);
              setIsEnd(true);
              return;
            }

            currentSectionElement = entry.target;
            const currentSectionId = entry.target.id;
            target = document.querySelector(`a[href="#${currentSectionId}"]`);

            if (!target) return;

            track = document.createElement('div');
            track.classList.add(styles.track);
            activePortion = document.createElement('div');
            activePortion.classList.add(styles.activePortion);

            track.appendChild(activePortion);
            target.appendChild(track);

            target.classList.add(styles.activeSectionNav);

            currentHandler = handleScrollGen(scroller);
            scroller.addEventListener('scroll', currentHandler);

            currentHandler();
          }
        });
      },
      {
        rootMargin: '-15% 0px -84% 0px',
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      const scroller = getScroller();
      observer.disconnect();
      if (currentHandler) scroller.removeEventListener('scroll', currentHandler);
    };
  }, []);

  return (
    <aside className={`${styles.hideOnMobile} ${isEnd ? styles.isEnd : ''} ${className || ''}`}>
      <ul>
        <li>
          <a
            className={styles.sidebarLink}
            href="#scsc"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('scsc');
            }}
          >
            SCSC
          </a>
        </li>
        <li>
          <a
            className={styles.sidebarLink}
            href="#activities"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('activities');
            }}
          >
            활동
          </a>
        </li>
        <li>
          <a
            className={styles.sidebarLink}
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('faq');
            }}
          >
            자주 묻는 질문
          </a>
        </li>
        <li>
          <a
            className={styles.sidebarLink}
            href="#clubroom"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('clubroom');
            }}
          >
            동아리 시설
          </a>
        </li>
        <li>
          <a
            className={styles.sidebarLink}
            href="#more"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('more');
            }}
          >
            더 알아보기
          </a>
        </li>
      </ul>
    </aside>
  );
}
