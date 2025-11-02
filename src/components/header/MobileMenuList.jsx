'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { headerMenuData, minExecutiveLevel } from '@/util/constants';
import { fetchMeClient } from '@/util/fetchClientData';
import styles from '@/app/Header.module.css';

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
    <Link
      href="/executive"
      className={`${styles.executiveLink} unset`}
      style={{ fontSize: '0.875rem' }}
    >
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
        ☰
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
                    onClick={() =>
                      setOpenedMenuIndex((prev) => (prev === index ? null : index))
                    }
                  >
                    {menu.title}
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
          </ul>

          <MobileExecutiveButton />
        </div>
      </div>
    </div>
  );
}
