import type { ComponentPropsWithoutRef } from 'react';
import type { ExtraProps } from 'react-markdown';
import Checkbox from './Checkbox';
import styles from './Checkbox.module.css';

/** Reuses the shared checkbox for Markdown tasks while preserving other native input types. */
export default function MarkdownInput({
  node: _node,
  type,
  className = '',
  ...props
}: ComponentPropsWithoutRef<'input'> & ExtraProps) {
  if (type !== 'checkbox') {
    return <input type={type} className={className} {...props} />;
  }

  return (
    <Checkbox {...props} className={`${styles.markdown} ${className}`}>
      {null}
    </Checkbox>
  );
}
