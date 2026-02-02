import { ENABLE_TEST_UTILS } from '@/util/constants';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

const MANAGEMENT_SECTIONS = [
  { title: '유저 관리', href: '/executive/user' },
  { title: 'HTML 관리', href: '/executive/w' },
  { title: '게시글 관리', href: '/executive/board' },
  { title: 'sig 관리', href: '/executive/sig' },
  { title: 'pig 관리', href: '/executive/pig' },
  { title: 'KV 테이블 관리', href: '/executive/kv' },
];

export default function TestutilsPage() {
  if (!ENABLE_TEST_UTILS) {
    notFound();
  }
  return (
    <main className={styles['main-page']}>
      <h1>Test Utils Console</h1>
      {MANAGEMENT_SECTIONS.map(({ title, href }) => (
        <section key={href} className="adm-section">
          <div className="adm-actions">
            <Link href={href} className="adm-button outline">
              {title}
            </Link>
          </div>
        </section>
      ))}
    </main>
  );
}
