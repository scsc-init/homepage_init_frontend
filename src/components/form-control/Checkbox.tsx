'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'children'> & {
  children: ReactNode;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, className = '', style, disabled, ...props },
  ref,
) {
  return (
    <label
      className={`${styles.label} ${className}`}
      style={style}
      data-disabled={disabled || undefined}
    >
      <input
        {...props}
        ref={ref}
        type="checkbox"
        className={styles.input}
        disabled={disabled}
      />
      <span className={styles.box} aria-hidden="true">
        <svg className={styles.icon} viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
});

export default Checkbox;
