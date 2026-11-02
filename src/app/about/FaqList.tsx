'use client';

import { useTranslations } from 'next-intl';

import { useRef, useState } from 'react';
import Arrow from './Arrow';
import styles from '@/app/about/about.module.css';

export default function FaqList() {
  const t = useTranslations('About');
  const faqs = ['time', 'eligibility', 'recruitment', 'beginners', 'dues', 'sig'].map((id) => ({
    id,
    question: t(`faq.${id}.question`),
    answer: t(`faq.${id}.answer`),
  }));

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className={styles.faqContainer}>
      <h2>{t('faqTitle')}</h2>
      {faqs.map((faq, idx) => (
        <div className={styles.faqItem} key={faq.id}>
          <button
            className={styles.faqQuestion}
            aria-expanded={openIdx === idx}
            aria-controls={`faq-${faq.id}`}
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <h4>{faq.question}</h4>
            <Arrow
              width="20px"
              height="20px"
              color="var(--foreground-color)"
              rotate={openIdx === idx ? '180deg' : '0deg'}
            />
          </button>

          <div
            className={styles.faqContent}
            id={`faq-${faq.id}`}
            ref={(el) => {
              contentRefs.current[idx] = el;
            }}
            style={{
              height: openIdx === idx ? `${contentRefs.current[idx]?.scrollHeight}px` : '0px',
            }}
          >
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
