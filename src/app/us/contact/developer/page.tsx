import DeveloperContactForm from './DeveloperContactForm';
import styles from './page.module.css';

export default function DeveloperContactPage() {
  return (
    <main className={styles.pageRoot}>
      <div className={styles.wallLogo}></div>
      <div className={styles.wallLogo2}></div>

      <div className={styles.home}>
        <div className={styles.homeContent}>
          <DeveloperContactForm />
        </div>
      </div>
    </main>
  );
}
