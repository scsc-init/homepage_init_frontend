'use client';

import styles from './ButtonInput.module.css';
import Button from '@/components/common/Button';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';

type ButtonInputProps = ComponentPropsWithoutRef<typeof Button> & {
  isSubmit?: boolean;
};

const ButtonInput = forwardRef<HTMLButtonElement, ButtonInputProps>(function ButtonInput(
  { children, isSubmit, type, ...props },
  ref,
) {
  return (
    <div className={styles.buttonInputGroup}>
      <Button ref={ref} {...props} type={type ?? (isSubmit ? 'submit' : 'button')}>
        {children}
      </Button>
    </div>
  );
});

export default ButtonInput;
