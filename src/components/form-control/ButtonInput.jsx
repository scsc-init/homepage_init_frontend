'use client';

import styles from './ButtonInput.module.css';

export default function ButtonInput({ children, className, isSubmit, onClick }) {
  return (
    <div className={styles.buttonInputGroup}>
      <button
        type={isSubmit ? 'submit' : 'button'}
        className={`${styles.buttonInput} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
