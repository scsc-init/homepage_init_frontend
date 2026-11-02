import { getTranslations } from 'next-intl/server';
import ScrollEffectWrapper from '../ScrollEffectWrapper';
import styles from '../about.module.css';
import DevelopersClient from './client';

export async function generateMetadata() {
  const t = await getTranslations('Developers');
  return { title: t('title') };
}

export default async function DevelopersPage() {
  const t = await getTranslations('Developers');
  return (
    <>
      <div className="wallLogo"></div>
      <div className="wallLogo2"></div>
      <div className={styles.executivePage}>
        <h2 className={styles.executiveTitle}>{t('title')}</h2>
        <ScrollEffectWrapper>
          <DevelopersClient />
        </ScrollEffectWrapper>
      </div>
    </>
  );
}
