'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SEMESTER_MAP, headerMenuData, minExecutiveLevel } from '@/util/constants';
import { useMe } from '@/util/hooks/useMe';
import { clearRedirectAfterLogin, isLoginPath, isSafeInternalPath } from '@/util/loginRedirect';
import styles from './Header.module.css';

export default function Header({ year, semester }) {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.left}>
            <HeaderLeft year={year} semester={semester} />
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

function HeaderLeft({ year, semester }) {
  return (
    <>
      <Link href="/" className="unset">
        <Image
          src="/vectors/logo.svg"
          alt="SCSC Logo"
          className={`logo ${styles.logo}`}
          width={100}
          height={40}
          priority={true}
        />
      </Link>
      {year && semester && (
        <div className={styles.semesterLabel}>
          {year} - {SEMESTER_MAP[semester]}학기
        </div>
      )}
    </>
  );
}

function HeaderCenter() {
  const [openedMenuIndex, setOpenedMenuIndex] = useState(null);
  const timeoutRef = useRef();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const open = (i) => {
    clearTimeout(timeoutRef.current);
    setOpenedMenuIndex(i);
  };
  const close = () => {
    timeoutRef.current = setTimeout(() => setOpenedMenuIndex(null), 300);
  };

  return (
    <ul className={styles.menuList}>
      {headerMenuData.map((menu, index) => {
        const items = menu.items || [];
        if (!items.length) return null;
        const openClass = openedMenuIndex === index ? styles.menuContentOpen : '';

        return (
          <li
            className={styles.menuItem}
            key={menu.title}
            onMouseEnter={() => open(index)}
            onMouseLeave={close}
          >
            <button className={styles.menuTrigger}>{menu.title}</button>
            <div className={`${styles.menuContent} ${openClass}`}>
              <ul>
                {items.map((item) => (
                  <li key={item.label}>
                    <Link className={styles.menuLink} href={item.url}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
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

function HeaderRight() {
  const router = useRouter();

  const [isExecutive, setIsExecutive] = useState(false);
  const [isMobile, setIsMobile] = useState(null);

  const { me: user, isLoading } = useMe();

  useEffect(() => {
    function updateIsMobile() {
      setIsMobile(window.innerWidth <= 768);
    }

    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);

    return () => {
      window.removeEventListener('resize', updateIsMobile);
    };
  }, []);

  useEffect(() => {
    setIsExecutive((user?.role ?? 0) >= minExecutiveLevel);
  }, [user]);

  function handleLoginClick(event) {
    event.preventDefault();

    clearRedirectAfterLogin();
    router.push(getLoginHrefFromCurrentPage());
  }

  const shouldShowDesktopContent = isMobile === false;

  return (
    <div>
      {isLoading && <div className={styles.rightLoading} />}

      {!isLoading && user === null && shouldShowDesktopContent && (
        <div className={styles.rightLogin}>
          <Link href="/us/login" onClick={handleLoginClick} className="unset decorateNone">
            가입 / 로그인
          </Link>
        </div>
      )}

      {user && shouldShowDesktopContent && (
        <div className={styles.rightMain}>
          {isExecutive && (
            <Link href="/executive" className={`${styles.executiveLink} unset`}>
              운영진 페이지
            </Link>
          )}
          <Link href="/about/my-page" className={`${styles.userLink} unset`}>
            <img
              src={user?.profile_picture || '/asset/default-pfp.webp'}
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

function MobileProfileButton() {
  const { me: user } = useMe();

  return (
    <>
      {user === null && (
        <Link href="/us/login" className={`${styles.mobileLoginLink} unset decorateNone`}>
          가입 / 로그인
        </Link>
      )}

      {user && (
        <Link href="/about/my-page" className={`${styles.mobileProfileLink} unset`}>
          <img
            src={user?.profile_picture || '/asset/default-pfp.webp'}
            alt="Profile"
            className={styles.mobileUserPic}
            width={40}
            height={40}
          />
          <span className={styles.userName}>{user.name}</span>
        </Link>
      )}
    </>
  );
}

function MobileExecutiveButton() {
  const { me: user } = useMe();
  const [isExecutive, setIsExecutive] = useState(false);
  useEffect(() => {
    setIsExecutive((user?.role ?? 0) >= minExecutiveLevel);
  }, [user]);

  if (!user || !isExecutive) return null;
  return (
    <Link href="/executive" className={`${styles.mobileExecutiveLink} unset`}>
      운영진 페이지
    </Link>
  );
}

function MobileMenuList() {
  const [openedMenuIndex, setOpenedMenuIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenedMenuIndex(null);
  }, [pathname, searchParams]);

  const wrapperClass = `${styles.mobileWrapper} ${mobileMenuOpen ? styles.mobileWrapperOpen : ''}`;

  return (
    <div>
      <button
        type="button"
        aria-expanded={mobileMenuOpen ? 'true' : 'false'}
        aria-controls="mobileMenuPanel"
        className={styles.hamburgerButton}
        onClick={() => setMobileMenuOpen((prev) => !prev)}
      >
        <span className="material-icons" style={{ fontSize: '2rem' }}>
          menu
        </span>
      </button>

      <div id="mobileMenuPanel" className={wrapperClass}>
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileMenuList}>
            {headerMenuData.map((menu, index) => {
              const items = menu.items || [];
              if (!items.length) return null;

              const subClass =
                openedMenuIndex === index
                  ? `${styles.mobileSubMenu} ${styles.mobileSubMenuOpen}`
                  : styles.mobileSubMenu;

              return (
                <li className={styles.mobileMenuItem} key={menu.title}>
                  <button
                    type="button"
                    className={styles.mobileTrigger}
                    aria-expanded={openedMenuIndex === index ? 'true' : 'false'}
                    onClick={() => {
                      setOpenedMenuIndex((prev) => (prev === index ? null : index));
                    }}
                  >
                    <span className={styles.menuTitle}>{menu.title}</span>
                    <span className={styles.menuDropdownIcon}>
                      <span className="material-icons" style={{ fontSize: '2rem' }}>
                        {openedMenuIndex === index
                          ? 'keyboard_arrow_up'
                          : 'keyboard_arrow_down'}
                      </span>
                    </span>
                  </button>
                  <div className={subClass}>
                    <ul>
                      {items.map((item) => (
                        <li key={item.label}>
                          <Link
                            className={styles.mobileSubLink}
                            href={item.url}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
            <li className={styles.mobileMenuItem}>
              <MobileExecutiveButton />
            </li>
            <li className={styles.mobileMenuItem}>
              <MobileProfileButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
