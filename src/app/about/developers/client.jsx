'use client';

import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../about.module.css';
import developerStyles from './developers.module.css';

const developers = [
  {
    name: '강명석',
    image: '/devs/kms.jpg',
    description: 'init 정상화해줬잖아 기능정의도해줬잖아 그냥 다해줬잖아',
    activeTerms: ['25-1', '25-S', '25-2', '25-W', '26-1'],
  },
  {
    name: '이한경',
    image: '/devs/lhk.jpg',
    description: '한경님의 백엔드 너무 좋아앗',
    activeTerms: ['25-1', '25-S', '25-2', '25-W', '26-1'],
  },
  {
    name: '박성현',
    image: '/devs/psh.jpg',
    description: '아주아주 귀여운 여고생',
    activeTerms: ['25-1', '25-S', '25-2', '25-W', '26-1'],
  },
  {
    name: '박상혁',
    image: '/devs/psh.jpg',
    description: 'SCSC 막스 베르슈타펜',
    activeTerms: ['25-2', '25-W'],
  },
  {
    name: '최정원',
    image: '',
    description: '',
    activeTerms: ['25-2', '25-W', '26-1'],
  },
  {
    name: '이태윤',
    image: '',
    description: '',
    activeTerms: ['25-2', '25-W', '26-1'],
  },
  {
    name: '황민기',
    image: '/devs/hmk.jpg',
    description: '커밋주작은뭐야',
    activeTerms: ['25-1', '25-S'],
  },
  {
    name: '윤영우',
    image: '/devs/yyw.jpg',
    description: '고능',
    activeTerms: ['25-S', '25-2'],
  },
];

function formatTerm(year, semester) {
  const shortYear = String(year).slice(-2);

  switch (semester) {
    case 1:
      return `${shortYear}-1`;
    case 2:
      return `${shortYear}-S`;
    case 3:
      return `${shortYear}-2`;
    case 4:
      return `${shortYear}-W`;
    default:
      return null;
  }
}

function parseTerm(term) {
  const [yearPart, semesterPart] = term.split('-');
  const year = Number(yearPart);
  const semesterOrderMap = {
    1: 1,
    S: 2,
    2: 3,
    W: 4,
  };

  return {
    year: Number.isNaN(year) ? -1 : year,
    semesterOrder: semesterOrderMap[semesterPart] ?? 99,
  };
}

function sortTermsDesc(a, b) {
  const parsedA = parseTerm(a);
  const parsedB = parseTerm(b);

  if (parsedA.year !== parsedB.year) return parsedB.year - parsedA.year;
  return parsedB.semesterOrder - parsedA.semesterOrder;
}

function FormerDevelopersSection({ semesterGroups }) {
  if (semesterGroups.length === 0) return null;

  return (
    <section className={developerStyles.formerDevelopersSection}>
      <div className={developerStyles.formerDevelopersHeader}>
        <h3 className={developerStyles.formerDevelopersTitle}>과거 개발자</h3>
      </div>

      <div className={developerStyles.formerSemesterList}>
        {semesterGroups.map((semesterGroup) => (
          <div key={semesterGroup.semester} className={developerStyles.formerSemesterBlock}>
            <div className={developerStyles.formerSemesterTitle}>{semesterGroup.semester}</div>

            <div className={developerStyles.formerMembersGrid}>
              {semesterGroup.members.map((member) => (
                <div
                  key={`${semesterGroup.semester}-${member.name}`}
                  className={developerStyles.formerMemberItem}
                >
                  <div className={developerStyles.formerMemberImageWrap}>
                    <Image
                      src={member.image || '/asset/default-pfp.png'}
                      alt={member.name}
                      fill
                      className={styles.image}
                    />
                  </div>

                  <div className={developerStyles.formerMemberName}>{member.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ExecutivesClient() {
  const [centerIndex, setCenterIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [currentTerm, setCurrentTerm] = useState('26-1');
  const autoRef = useRef();

  useEffect(() => {
    let ignore = false;

    const fetchCurrentTerm = async () => {
      try {
        const res = await fetch('/api/scsc/global/status', {
          cache: 'no-store',
        });

        if (!res.ok) return;

        const data = await res.json();
        const formatted = formatTerm(data?.year, data?.semester);

        if (!ignore && formatted) {
          setCurrentTerm(formatted);
        }
      } catch (error) {
        console.error('현재 학기 정보를 불러오지 못했습니다.', error);
      }
    };

    fetchCurrentTerm();

    return () => {
      ignore = true;
    };
  }, []);

  const { currentDevelopers, formerDevelopersBySemester } = useMemo(() => {
    const current = developers.filter((developer) =>
      developer.activeTerms.includes(currentTerm),
    );

    const formerGroupsMap = new Map();

    developers.forEach((developer) => {
      developer.activeTerms
        .filter((term) => term !== currentTerm)
        .forEach((term) => {
          if (!formerGroupsMap.has(term)) {
            formerGroupsMap.set(term, []);
          }

          formerGroupsMap.get(term).push({
            name: developer.name,
            image: developer.image,
            description: developer.description,
          });
        });
    });

    const formerGroups = Array.from(formerGroupsMap.entries())
      .sort(([termA], [termB]) => sortTermsDesc(termA, termB))
      .map(([semester, members]) => ({
        semester,
        members,
      }));

    return {
      currentDevelopers: current,
      formerDevelopersBySemester: formerGroups,
    };
  }, [currentTerm]);

  const total = currentDevelopers.length;

  const next = useCallback(() => {
    if (total === 0) return;
    setCenterIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total === 0) return;
    setCenterIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (centerIndex >= total) {
      setCenterIndex(0);
    }
  }, [centerIndex, total]);

  useEffect(() => {
    if (total === 0) return undefined;

    if (!hovered) {
      autoRef.current = setInterval(() => {
        next();
      }, 4000);
    }

    return () => clearInterval(autoRef.current);
  }, [hovered, next, total]);

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  const positionClass = (idx) => {
    if (total === 0) return '';

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
          {currentDevelopers.map((person, idx) => (
            <div
              className={`${styles.carouselCard} ${positionClass(idx)}`}
              key={person.name}
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
          {currentDevelopers.map((person, i) => (
            <div
              key={person.name}
              className={`${styles.carouselDot} ${i === centerIndex ? styles.carouselDotActive : ''}`}
              onClick={() => setCenterIndex(i)}
            />
          ))}
        </div>
      </div>

      <div className={styles.masonry}>
        {currentDevelopers.map((person) => (
          <div className={styles.masonryCard} key={person.name}>
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

      <FormerDevelopersSection semesterGroups={formerDevelopersBySemester} />
    </>
  );
}
