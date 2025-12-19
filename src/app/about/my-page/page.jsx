import dynamic from 'next/dynamic';
import styles from '../about.module.css';

// 클라이언트 전용 컴포넌트 dynamic import
const MyPageClient = dynamic(() => import('@/components/about/MyProfileClient'), {
  ssr: false,
});

export default function MyPage() {
  return (
    <div className={styles.myPageContainer}>
      <div className={styles.myPageCard}>
        <MyPageClient />
      </div>
    </div>
  );
}
