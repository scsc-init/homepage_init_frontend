'use client';

import styles from './ButtonInput.module.css';

export default function ButtonInput({ children, className, isSubmit }) {
  return (
    <button
      type={isSubmit ? 'submit' : 'button'}
      className={`${styles.buttonInput} ${className}`}
    >
      {children}
    </button>
  );
}
