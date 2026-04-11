'use client';

import styles from './EditorInput.module.css';

import { Controller } from 'react-hook-form';
import Editor from '@/components/board/EditorWrapper.jsx';
import { useEffect, useState } from 'react';

export default function EditorInput({ label, control, name, editorKey }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const target = document.documentElement;
    setIsDark(target.classList.contains('dark'));

    const observer = new MutationObserver((mutations) => {
      setIsDark(target.classList.contains('dark'));
    });

    observer.observe(target, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.editorInputGroup}>
      <span className={styles.editorInputLabel}>{label}</span>
      <Controller
        name="editor"
        control={control}
        render={({ field }) => (
          <Editor
            key={editorKey}
            id={name}
            markdown={typeof field.value === 'string' ? field.value : ''}
            onChange={field.onChange}
            className={`${styles.editorInput} ${isDark ? 'dark-theme dark-editor' : ''}`}
          />
        )}
      />
    </div>
  );
}
