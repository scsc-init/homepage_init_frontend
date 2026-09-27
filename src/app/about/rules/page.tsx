import ReactMarkdown from 'react-markdown';
import { RULES_MARKDOWN_LINK } from '@/util/constants';
import styles from '../about.module.css';

export const dynamic = 'force-dynamic';

async function fetchMarkdown() {
  const res = await fetch(RULES_MARKDOWN_LINK, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch regulation markdown.');
  }
  return res.text();
}

export default async function RegulationPage() {
  const markdow = await fetchMarkdown();
  const markdown = markdow.replace('<!-- SCSC 회칙 -->', '');

  return (
    <>
      <div className="wallLogo"></div>
      <div className="wallLogo2"></div>
      <main className={styles.centeredMainContent}>
        <section id="rules" className={`${styles.section} ${styles.anchorOffset}`}>
          <div className={styles.inner}>
            <h1 className={styles.title}>회칙</h1>
            <div className={styles.regulationCard}>
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
