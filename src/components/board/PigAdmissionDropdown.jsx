'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './board.module.css';
import { PIG_ADMISSION_LABEL_MAP } from '@/util/constants';

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

  return (
    <div className={`${styles.pigAdmissionDropdown} ${styles.fixedWidth}`} ref={dropdownRef}>
      <button
        type="button"
        className={styles.pigAdmissionBtn}
        onClick={() => setOpen((prev) => !prev)}
      >
        {PIG_ADMISSION_LABEL_MAP[pigAdmissionState]} ▼
      </button>
      {open && (
        <div
          className={`${styles.pigAdmissionMenu} ${styles.pigAdmissionMenuOpen} ${styles.fixedWidth}`}
        >
          <button
            type="button"
            onClick={() => {
              setPigAdmissionState('always');
              setOpen(false);
            }}
          >
            {PIG_ADMISSION_LABEL_MAP.always}
          </button>
          <button
            type="button"
            onClick={() => {
              setPigAdmissionState('during_recruiting');
              setOpen(false);
            }}
          >
            {PIG_ADMISSION_LABEL_MAP.during_recruiting}
          </button>
          <button
            type="button"
            onClick={() => {
              setPigAdmissionState('never');
              setOpen(false);
            }}
          >
            {PIG_ADMISSION_LABEL_MAP.never}
          </button>
        </div>
      )}
    </div>
  );
}
