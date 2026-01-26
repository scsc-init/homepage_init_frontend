import { ENABLE_TEST_UTILS } from '@/util/constants';
import { notFound } from 'next/navigation';
import NextauthConsole from './NextauthConsole';
import styles from './page.module.css';

export default function TestutilsPage() {
  if (!ENABLE_TEST_UTILS) {
    notFound();
  }
  return (
    <main className={styles['main-page']}>
      <h1>Test Utils Console</h1>
      <NextauthConsole />
    </main>
  );
}
