import ReactMarkdown from 'react-markdown';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getLocale, getTranslations } from 'next-intl/server';
import { RULES_MARKDOWN_LINK } from '@/util/constants';
import styles from '../about.module.css';

export const dynamic = 'force-dynamic';

async function fetchMarkdown(locale: string) {
  if (locale === 'en-US') {
    return readFile(path.join(process.cwd(), 'public/about/rules/en-US.md'), 'utf8');
  }

  const res = await fetch(RULES_MARKDOWN_LINK, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch regulation markdown.');
  }
  return res.text();
}

export async function generateMetadata() {
  const t = await getTranslations('Rules');
  return { title: t('title') };
}

export default async function RegulationPage() {
  const locale = await getLocale();
  const t = await getTranslations('Rules');
  const markdown = await fetchMarkdown(locale).catch(() => null);

  return (
    <>
      <div className="wallLogo"></div>
      <div className="wallLogo2"></div>
      <main className={styles.centeredMainContent}>
        <section id="rules" className={`${styles.section} ${styles.anchorOffset}`}>
          <div className={styles.inner}>
            <h1 className={styles.title}>{t('title')}</h1>
            <div className={styles.regulationCard}>
              {locale === 'en-US' && <p>{t('translationNotice')}</p>}
              <p>
                <a href={RULES_MARKDOWN_LINK} target="_blank" rel="noopener noreferrer">
                  {t('original')}
                </a>
              </p>
              {markdown ? (
                <ReactMarkdown>{markdown.replace('<!-- SCSC 회칙 -->', '')}</ReactMarkdown>
              ) : (
                <p role="status">{t('loadError')}</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
