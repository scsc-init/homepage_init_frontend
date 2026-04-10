'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { headerMenuData, minExecutiveLevel } from '@/util/constants';
import { fetchMeClient } from '@/util/fetchClientData';
import styles from '@/app/Header.module.css';

function MobileProfileButton() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetchMeClient().then(setUser);
  }, []);

  return (
    <>
      {user === null && (
        <Link href="/us/login" className="unset decorateNone">
          가입 / 로그인
        </Link>
      )}

      {user && (
        <Link href="/about/my-page" className={`${styles.mobileProfileLink} unset`}>
          <img
            src={user?.profile_picture || '/asset/default-pfp.png'}
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
  const [user, setUser] = useState(undefined);
  const [isExecutive, setIsExecutive] = useState(false);

  useEffect(() => {
    fetchMeClient().then(setUser);
  }, []);
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

export default function MobileMenuList() {
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
