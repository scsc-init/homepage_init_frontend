// src/app/executive/footer/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import FooterMessage from './FooterMessage';
import styles from '../igpage.module.css';

export default async function ExecutiveFooterPage() {
  return (
    <WithAuthorization>
      <div className={styles['admin-panel']}>
        <h2>Footer Message 관리</h2>
        <div className={styles['adm-section']}>
          <FooterMessage />
        </div>
      </div>
    </WithAuthorization>
  );
}
