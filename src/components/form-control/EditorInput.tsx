'use client';

import styles from './EditorInput.module.css';

import { Controller } from 'react-hook-form';
import Editor from './EditorWrapper';
import { useEffect, useState } from 'react';
import type { Control, FieldPathByValue, FieldValues } from 'react-hook-form';

type EditorInputProps<TFieldValues extends FieldValues> = {
  label: string;
  control: Control<TFieldValues>;
  name: FieldPathByValue<TFieldValues, string>;
  editorKey?: string | number;
  className?: string;
};

export default function EditorInput<TFieldValues extends FieldValues>({
  label,
  control,
  name,
  editorKey,
  className,
}: EditorInputProps<TFieldValues>) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const target = document.documentElement;
    setIsDark(target.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(target.classList.contains('dark'));
    });

    observer.observe(target, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.editorInputGroup} key={name}>
      <span className={styles.editorInputLabel}>{label}</span>
      <Controller<TFieldValues, FieldPathByValue<TFieldValues, string>>
        name={name}
        control={control}
        render={({ field }) => (
          <Editor
            key={editorKey}
            markdown={typeof field.value === 'string' ? field.value : ''}
            onChange={field.onChange}
            className={`${styles.editorInput} ${className ?? ''} ${isDark ? 'dark-theme dark-editor' : ''}`.trim()}
          />
        )}
      />
    </div>
  );
}
