'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { EXECUTIVE_NAV_GROUPS, EXECUTIVE_NAV_ITEMS } from './navigation';
import styles from './layout.module.css';

function matchesPath(pathname, href) {
  if (href === '/executive') return pathname === '/executive';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function ExecutiveSidebar() {
  const pathname = usePathname();

  const activeHref = useMemo(() => {
    return EXECUTIVE_NAV_ITEMS.filter(
      (item) => !item.external && matchesPath(pathname, item.href),
    ).sort((a, b) => b.href.length - a.href.length)[0]?.href;
  }, [pathname]);

  return (
    <aside className={styles.sidebar} aria-label="관리자 페이지 네비게이션">
      <div className={styles.sidebarHeader}>
        <Link href="/executive" className={styles.sidebarTitle}>
          관리자 페이지
        </Link>
        <p className={styles.sidebarDescription}>관리 기능 바로가기</p>
      </div>

      <nav className={styles.nav}>
        {EXECUTIVE_NAV_GROUPS.map((group) => (
          <section className={styles.navGroup} key={group.title}>
            <h2 className={styles.navGroupTitle}>{group.title}</h2>
            <ul className={styles.navList}>
              {group.items.map((item) => {
                const isActive = activeHref === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className={styles.navLinkTitle}>{item.title}</span>
                      {item.external && <span className={styles.externalBadge}>외부</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
    </aside>
  );
}
