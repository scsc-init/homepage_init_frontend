'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', type = 'button', className = '', ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={`${styles.button} ${className}`}
      data-variant={variant}
      data-size={size}
    />
  );
});

export function ButtonLink({ variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <Link
      {...props}
      className={`${styles.button} ${className}`}
      data-variant={variant}
      data-size={size}
    />
  );
}

export default Button;
