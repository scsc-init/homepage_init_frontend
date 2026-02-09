'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './board.module.css';

export default function PigAdmissionDropdown({ pigAdmissionState, setPigAdmissionState }) {
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
    always: '항상 가입 받기',
    during_recruiting_period: 'SIG 가입 기간에만 가입 받기',
    never: '항상 가입 받지 않기',
  };

  return (
    <div className={`${styles.pigAdmissionDropdown} ${styles.fixedWidth}`} ref={dropdownRef}>
      <button className={styles.pigAdmissionBtn} onClick={() => setOpen((prev) => !prev)}>
        {labelMap[pigAdmissionState]} ▼
      </button>
      {open && (
        <div
          className={`${styles.pigAdmissionMenu} ${styles.pigAdmissionMenuOpen} ${styles.fixedWidth}`}
        >
          <button
            onClick={() => {
              setPigAdmissionState('always');
              setOpen(false);
            }}
          >
            항상 받기
          </button>
          <button
            onClick={() => {
              setPigAdmissionState('during_recruiting_period');
              setOpen(false);
            }}
          >
            SIG 가입 기간에만 받기
          </button>
          <button
            onClick={() => {
              setPigAdmissionState('never');
              setOpen(false);
            }}
          >
            항상 받지 않기
          </button>
        </div>
      )}
    </div>
  );
}
