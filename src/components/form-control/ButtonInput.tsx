'use client';

import styles from './ButtonInput.module.css';
import Button from '@/components/common/Button';

import type { ComponentProps } from 'react';

type ButtonInputProps = ComponentProps<typeof Button> & {
  isSubmit?: boolean;
};

export default function ButtonInput({ children, isSubmit, type, ...props }: ButtonInputProps) {
  return (
    <div className={styles.buttonInputGroup}>
      <Button {...props} type={type ?? (isSubmit ? 'submit' : 'button')}>
        {children}
      </Button>
    </div>
  );
}
