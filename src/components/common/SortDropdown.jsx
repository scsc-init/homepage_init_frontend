'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './SortDropdown.module.css';

export default function SortDropdown({ sortOrder, setSortOrder }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const labelMap = {
    latest: '최신순',
    oldest: '오래된 순',
    title: '제목순',
  };

  return (
    <div className={`${styles.sortDropdown} ${styles.fixedWidth}`} ref={dropdownRef}>
      <button className={styles.sortBtn} onClick={() => setOpen((prev) => !prev)}>
        {labelMap[sortOrder]} ▼
      </button>
      {open && (
        <div className={`${styles.sortMenu} ${styles.sortMenuOpen} ${styles.fixedWidth}`}>
          <button
            className={styles.sortOption}
            onClick={() => {
              setSortOrder('latest');
              setOpen(false);
            }}
          >
            최신순
          </button>
          <button
            className={styles.sortOption}
            onClick={() => {
              setSortOrder('oldest');
              setOpen(false);
            }}
          >
            오래된 순
          </button>
          <button
            className={styles.sortOption}
            onClick={() => {
              setSortOrder('title');
              setOpen(false);
            }}
          >
            제목순
          </button>
        </div>
      )}
    </div>
  );
}
