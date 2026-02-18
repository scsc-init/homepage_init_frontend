import styles from '../about.module.css';

// 클라이언트 전용 컴포넌트 import
import MyPageClient from '@/components/about/MyProfileClient';

export default function MyPage() {
  return (
    <div className={styles.myPageContainer}>
      <div className={styles.myPageCard}>
        <MyPageClient />
      </div>
    </div>
  );
}
