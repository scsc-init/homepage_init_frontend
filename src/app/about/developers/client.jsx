'use client';

import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';
import { useEffect, useRef, useState, useMemo } from 'react';
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
  const total = executives.length;
  const autoRef = useRef();

  const prev = () => {
    setCenterIndex((prev) => (prev - 1 + total) % total);
  };

  const next = () => {
    setCenterIndex((prev) => (prev + 1) % total);
  };

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
  }, [hovered, isMobile]);

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  const positionClass = (idx) => {
    const offset = (idx - centerIndex + total) % total;
    if (offset === 0) return 'center';
    if (offset === 1 || offset === -total + 1) return 'right-1';
    if (offset === 2 || offset === -total + 2) return 'right-2';
    if (offset === total - 1) return 'left-1';
    if (offset === total - 2) return 'left-2';
    return 'hidden';
  };

  if (isMobile) {
    return (
      <div className="ExecutiveMasonry">
        {executives.map((person, i) => (
          <div className="ExecutiveCard" key={i}>
            <div className="ExecutiveImageWrapper">
              <Image src={person.image} alt={person.name} fill className="ExecutiveImage" />
              <div className="ExecutiveOverlay">
                <p className="ExecutiveDescription">{person.description}</p>
              </div>
            </div>
            <h3>{person.name}</h3>
            <p className="ExecutiveRole">{person.role}</p>
            {person.phone && <p className="ExecutivePhone">{person.phone}</p>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="ExecutiveCarouselWrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...handlers}
    >
      {/*<button className="ExecutiveArrow left" onClick={prev}>
        ◀
      </button>*/}
      <div className="ExecutiveCarouselCentered">
        {executives.map((person, idx) => (
          <div
            className={`ExecutiveCard ${positionClass(idx)}`}
            key={idx}
            style={{
              transition: 'transform 0.6s ease, opacity 0.6s ease',
            }}
          >
            <div className="ExecutiveImageWrapper">
              <Image src={person.image} alt={person.name} fill className="ExecutiveImage" />
            </div>
            <h3>{person.name}</h3>
            <p className="ExecutiveRole">{person.role}</p>
            {person.phone && <p className="ExecutivePhone">{person.phone}</p>}
          </div>
        ))}
      </div>
      {/*<button className="ExecutiveArrow right" onClick={next}>
        ▶
      </button>*/}
      <div className="ExecutiveDots">
        {executives.map((_, i) => (
          <div
            key={i}
            className={`ExecutiveDot ${i === centerIndex ? 'active' : ''}`}
            onClick={() => setCenterIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
