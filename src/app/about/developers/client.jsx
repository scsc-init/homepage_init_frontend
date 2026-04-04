'use client';

import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../about.module.css';

const executives = [
  {
    name: '강명석',
    image: '/devs/kms.jpg',
    description: 'init 정상화해줬잖아 기능정의도해줬잖아 그냥 다해줬잖아',
  },
  {
    name: '이한경',
    image: '/devs/lhk.jpg',
    description: '한경님의 백엔드 너무 좋아앗',
  },
  {
    name: '박성현',
    image: '/devs/psh.jpg',
    description: '아주아주 귀여운 여고생',
  },
  {
    name: '박상혁(Ethan)',
    image: '/devs/psh.jpg',
    description: 'SCSC 막스 베르슈타펜',
  },
  {
    name: '최정원',
    image: '',
    description: '',
  },
  {
    name: '이태윤',
    image: '',
    description: '',
  },
];

const formerDevelopersBySemester = [
  {
    semester: '2025-2',
    members: [
      {
        name: '황민기',
        image: '/devs/hmk.jpg',
        description: '커밋주작은뭐야',
      },
      {
        name: '윤영우',
        image: '/devs/yyw.jpg',
        description: '고능',
      },
    ],
  },
];

export default function ExecutivesClient() {
  const [centerIndex, setCenterIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const autoRef = useRef();
  const total = executives.length;

  const next = useCallback(() => {
    setCenterIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCenterIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!hovered) {
      autoRef.current = setInterval(() => {
        next();
      }, 4000);
    }
    return () => clearInterval(autoRef.current);
  }, [hovered, next]);

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

  return (
    <>
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
                <Image
                  src={person.image || '/asset/default-pfp.png'}
                  alt={person.name}
                  fill
                  className={styles.image}
                />
              </div>
              <h3>{person.name}</h3>
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

      <div className={styles.masonry}>
        {executives.map((person, i) => (
          <div className={styles.masonryCard} key={i}>
            <div className={styles.imageWrapper}>
              <Image
                src={person.image || '/asset/default-pfp.png'}
                alt={person.name}
                fill
                className={styles.image}
              />
              <div className={styles.overlay}>
                <p className={styles.description}>{person.description}</p>
              </div>
            </div>
            <h3>{person.name}</h3>
          </div>
        ))}
      </div>

      <section className={styles.formerDevelopersSection}>
        <div className={styles.formerDevelopersHeader}>
          <h3 className={styles.formerDevelopersTitle}>과거 개발자</h3>
        </div>

        <div className={styles.formerSemesterList}>
          {formerDevelopersBySemester.map((semesterGroup) => (
            <div key={semesterGroup.semester} className={styles.formerSemesterBlock}>
              <div className={styles.formerSemesterTitle}>{semesterGroup.semester}</div>

              <div className={styles.formerMembersGrid}>
                {semesterGroup.members.map((member, index) => (
                  <article
                    key={`${semesterGroup.semester}-${member.name}-${index}`}
                    className={styles.formerMemberCard}
                  >
                    <div className={styles.formerMemberImageWrap}>
                      <Image
                        src={member.image || '/asset/default-pfp.png'}
                        alt={member.name}
                        fill
                        className={styles.image}
                      />
                    </div>

                    <div className={styles.formerMemberText}>
                      <div className={styles.formerMemberName}>{member.name}</div>
                      <div className={styles.formerMemberDescription}>{member.description}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
