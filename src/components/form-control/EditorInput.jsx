'use client';

import styles from './EditorInput.module.css';

import { Controller } from 'react-hook-form';
import Editor from '@/components/board/EditorWrapper.jsx';
import { useEffect, useState } from 'react';

export default function EditorInput({ label, control, name }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let target = document.documentElement;

    setIsDark(target.classList.contains('dark'));

    let observer = new MutationObserver((mutations) => {
      setIsDark(target.classList.contains('dark'));
    });

    observer.observe(target, { attributes: true });
  }, []);

  return (
    <div className={styles.editorInputGroup}>
      <label htmlFor={`editorinput-${name}`} className={styles.editorInputLabel}>
        {label}
      </label>
      <Controller
        name="editor"
        control={control}
        render={({ field }) => (
          <Editor
            key={0}
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
