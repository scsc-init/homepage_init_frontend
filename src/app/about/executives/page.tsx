import { getTranslations } from 'next-intl/server';
import ScrollEffectWrapper from '../ScrollEffectWrapper';
import styles from '../about.module.css';
import ExecutivesClient from './client';

export async function generateMetadata() {
  const t = await getTranslations('Executives');
  return { title: t('title') };
}

export default async function ExecutivesPage() {
  const t = await getTranslations('Executives');
  return (
    <>
      <div className="wallLogo"></div>
      <div className="wallLogo2"></div>
      <div className={styles.executivePage}>
        <h2 className={styles.executiveTitle}>{t('title')}</h2>
        <ScrollEffectWrapper>
          <ExecutivesClient />
        </ScrollEffectWrapper>
      </div>
    </>
  );
}
