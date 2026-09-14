'use client';

import styles from './ButtonInput.module.css';
import Button from '@/components/common/Button';

export default function ButtonInput({ children, isSubmit, type, ...props }) {
  return (
    <div className={styles.buttonInputGroup}>
      <Button {...props} type={type ?? (isSubmit ? 'submit' : 'button')}>
        {children}
      </Button>
    </div>
  );
}
