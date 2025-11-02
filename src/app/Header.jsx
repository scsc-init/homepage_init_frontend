import { unstable_noStore as noStore } from 'next/cache';
import HeaderLeft from '@/components/header/HeaderLeft';
import HeaderCenter from '@/components/header/HeaderCenter';
import HeaderRight from '@/components/header/HeaderRight';
import MobileMenuList from '@/components/header/MobileMenuList';
import { fetchSCSCGlobalStatus } from '@/util/fetchAPIData';
import styles from './Header.module.css';

export default async function Header() {
  noStore();
  const scscGlobalStatus = await fetchSCSCGlobalStatus();

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.left}>
            <HeaderLeft
              year={scscGlobalStatus ? scscGlobalStatus.year : null}
              semester={scscGlobalStatus ? scscGlobalStatus.semester : null}
            />
          </div>
          <div className={styles.center}>
            <HeaderCenter />
          </div>
          <div className={styles.right}>
            <HeaderRight />
            <MobileMenuList />
          </div>
        </div>
      </div>
      <div className={styles.spacer} />
    </div>
  );
}
