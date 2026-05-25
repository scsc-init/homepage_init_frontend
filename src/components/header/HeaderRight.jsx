'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/util/hooks/useMe';
import { minExecutiveLevel } from '@/util/constants';
import { clearRedirectAfterLogin, isLoginPath, isSafeInternalPath } from '@/util/loginRedirect';
import styles from '@/app/Header.module.css';

function isMobileViewport() {
  try {
    return (window.innerWidth || 1000) <= 768;
  } catch {
    return false;
  }
}

function getLoginHrefFromCurrentPage() {
  if (typeof window === 'undefined') return '/us/login';

  const { pathname, search } = window.location;
  const currentPath = `${pathname}${search || ''}`;

  const shouldPreserveCurrentPath =
    isSafeInternalPath(currentPath) &&
    !isLoginPath(pathname) &&
    !pathname.startsWith('/api') &&
    pathname !== '/us/register' &&
    pathname !== '/us/login/callback';

  return shouldPreserveCurrentPath
    ? `/us/login?redirect=${encodeURIComponent(currentPath)}`
    : '/us/login';
}

export default function HeaderRight() {
  const router = useRouter();

  const [isExecutive, setIsExecutive] = useState(false);

  const { me: user, isLoading } = useMe();

  useEffect(() => {
    setIsExecutive((user?.role ?? 0) >= minExecutiveLevel);
  }, [user]);

  function handleLoginClick(event) {
    event.preventDefault();

    clearRedirectAfterLogin();
    router.push(getLoginHrefFromCurrentPage());
  }

  return (
    <div>
      {isLoading && <div className={styles.rightLoading} />}

      {user === null && !isMobileViewport() && (
        <div className={styles.rightLogin}>
          <Link href="/us/login" onClick={handleLoginClick} className="unset decorateNone">
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
