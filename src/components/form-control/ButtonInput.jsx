'use client';

import styles from './ButtonInput.module.css';

export default function ButtonInput({ children, className, isSubmit, ...props }) {
  return (
    <button
      type={isSubmit ? 'submit' : 'button'}
      className={`${styles.buttonInput} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
