'use client';

import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Executive');
  const pathname = usePathname();

  const activeHref = useMemo(() => {
    return EXECUTIVE_NAV_ITEMS.filter(
      (item) => !item.external && matchesPath(pathname, item.href),
    ).sort((a, b) => b.href.length - a.href.length)[0]?.href;
  }, [pathname]);

  return (
    <aside className={styles.sidebar} aria-label={t('navigationLabel')}>
      <div className={styles.sidebarHeader}>
        <Link href="/executive" className={styles.sidebarTitle}>
          {t('adminPage')}
        </Link>
        <p className={styles.sidebarDescription}>{t('adminShortcuts')}</p>
      </div>

      <nav className={styles.nav}>
        {EXECUTIVE_NAV_GROUPS.map((group) => (
          <section className={styles.navGroup} key={group.title}>
            <h2 className={styles.navGroupTitle}>{t(group.title)}</h2>
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
                      <span className={styles.navLinkTitle}>{t(item.title)}</span>
                      {item.external && (
                        <span className={styles.externalBadge}>{t('external')}</span>
                      )}
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
