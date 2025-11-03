'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { headerMenuData } from '@/util/constants';
import styles from '@/app/Header.module.css';

export default function HeaderCenter() {
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
