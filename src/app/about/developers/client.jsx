'use client';

import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../about.module.css';

const executives = [
  {
    name: '강명석',
    role: '대장',
    image: '/devs/kms.jpg',
    description: 'init 정상화해줬잖아 기능정의도해줬잖아 그냥 다해줬잖아',
  },
  {
    name: '이한경',
    role: '백엔드',
    image: '/devs/lhk.jpg',
    description: '한경님의 백엔드 너무 좋아앗',
  },
  {
    name: '박성현',
    role: '프론트',
    image: '/devs/psh.jpg',
    description: '아주아주 귀여운 여고생',
  },
  {
    name: '황민기',
    role: '봇이지뭐',
    image: '/devs/hmk.jpg',
    description: '커밋주작은뭐야',
  },
  {
    name: '김재희',
    role: '백엔드?',
    image: '/devs/kjh.jpg',
    description: '분명 프론트 대신 해줄줄 알았는데',
  },
  {
    name: '윤영우',
    role: '백엔드',
    image: '/devs/yyw.jpg',
    description: '고능',
  },
  {
    name: '박상혁(Ethan)',
    role: '백엔드, 프론트엔드',
    image: '/devs/psh.jpg',
    description: 'SCSC 막스 베르슈타펜',
  },
];
export default function ExecutivesClient() {
  const [centerIndex, setCenterIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoRef = useRef();
  const total = executives.length;

  const next = useCallback(() => {
    setCenterIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCenterIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!hovered && !isMobile) {
      autoRef.current = setInterval(() => {
        next();
      }, 4000);
    }
    return () => clearInterval(autoRef.current);
  }, [hovered, isMobile, next]);

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  const positionClass = (idx) => {
    const offset = (idx - centerIndex + total) % total;
    if (offset === 0) return styles.carouselCardCenter;
    if (offset === 1 || offset === -total + 1) return styles.carouselCardRight1;
    if (offset === 2 || offset === -total + 2) return styles.carouselCardRight2;
    if (offset === total - 1) return styles.carouselCardLeft1;
    if (offset === total - 2) return styles.carouselCardLeft2;
    return '';
  };

  if (isMobile) {
    return (
      <div className={styles.masonry}>
        {executives.map((person, i) => (
          <div className={styles.masonryCard} key={i}>
            <div className={styles.imageWrapper}>
              <Image src={person.image} alt={person.name} fill className={styles.image} />
              <div className={styles.overlay}>
                <p className={styles.description}>{person.description}</p>
              </div>
            </div>
            <h3>{person.name}</h3>
            <p className={styles.roleText}>{person.role}</p>
            {person.phone && <p className={styles.roleText}>{person.phone}</p>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={styles.carouselWrapper}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...handlers}
    >
      <div className={styles.carouselCentered}>
        {executives.map((person, idx) => (
          <div
            className={`${styles.carouselCard} ${positionClass(idx)}`}
            key={idx}
            style={{
              transition: 'transform 0.6s ease, opacity 0.6s ease',
            }}
          >
            <div className={styles.imageWrapper}>
              <Image src={person.image} alt={person.name} fill className={styles.image} />
            </div>
            <h3>{person.name}</h3>
            <p className={styles.roleText}>{person.role}</p>
            {person.phone && <p className={styles.roleText}>{person.phone}</p>}
          </div>
        ))}
      </div>
      <div className={styles.carouselDots}>
        {executives.map((_, i) => (
          <div
            key={i}
            className={`${styles.carouselDot} ${i === centerIndex ? styles.carouselDotActive : ''}`}
            onClick={() => setCenterIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
