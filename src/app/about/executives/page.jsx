import ScrollEffectWrapper from '@/components/about/ScrollEffectWrapper';
import styles from '../about.module.css';
import ExecutivesClient from './client';

export default function ExecutivesPage() {
  return (
    <>
      <div className="wallLogo"></div>
      <div className="wallLogo2"></div>
      <div className={styles.executivePage}>
        <h2 className={styles.executiveTitle}>임원진 소개</h2>
        <ScrollEffectWrapper>
          <ExecutivesClient />
        </ScrollEffectWrapper>
      </div>
    </>
  );
}
