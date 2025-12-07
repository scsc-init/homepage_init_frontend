import dynamic from 'next/dynamic';
import ScrollEffectWrapper from '@/components/about/ScrollEffectWrapper';
import styles from '../about.module.css';

const ExecutivesClient = dynamic(() => import('./client'), { ssr: false });

export default function ExecutivesPage() {
  return (
    <>
      <div className={styles.wallLogo}></div>
      <div className={styles.wallLogo2}></div>
      <div className={styles.executivePage}>
        <h2 className={styles.executiveTitle}>개발자 소개</h2>
        <ScrollEffectWrapper>
          <ExecutivesClient />
        </ScrollEffectWrapper>
      </div>
    </>
  );
}
