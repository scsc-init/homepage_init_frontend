'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMe } from '@/util/hooks/useMe';
import { minExecutiveLevel } from '@/util/constants';
import styles from '@/app/Header.module.css';

function isMobileViewport() {
  try {
    return (window.innerWidth || 1000) <= 768;
  } catch {
    return false;
  }
}

export default function HeaderRight() {
  const [isExecutive, setIsExecutive] = useState(false);

  const { me: user, isLoading } = useMe();
  useEffect(() => {
    setIsExecutive((user?.role ?? 0) >= minExecutiveLevel);
  }, [user]);

  return (
    <div>
      {isLoading && <div className={styles.rightLoading} />}

      {user === null && !isMobileViewport() && (
        <div className={styles.rightLogin}>
          <Link href="/us/login" className="unset decorateNone">
            가입 / 로그인
          </Link>
        </div>
      )}

      {user && !isMobileViewport() && (
        <div className={styles.rightMain}>
          {isExecutive && (
            <Link href="/executive" className={`${styles.executiveLink} unset`}>
              운영진 페이지
            </Link>
          )}
          <Link href="/about/my-page" className={`${styles.userLink} unset`}>
            <img
              src={user?.profile_picture || '/asset/default-pfp.png'}
              alt="Profile"
              className={styles.userPic}
              width={24}
              height={24}
            />
            <span className={styles.userName}>{user.name}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
