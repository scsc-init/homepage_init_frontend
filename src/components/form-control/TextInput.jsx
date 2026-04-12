'use client';

import { useEffect } from 'react';
import styles from './TextInput.module.css';

export default function TextInput({
  label,
  placeholder,
  register,
  name,
  activePageIndex,
  activateNext,
  deactivateNext,
}) {
  useEffect(() => {
    if (document.querySelector(`#textinput-${name}`).value) {
      activateNext();
    } else {
      deactivateNext();
    }
  }, [activePageIndex]);

  return (
    <div className={styles.textInputGroup} key={name}>
      <label htmlFor={`textinput-${name}`} className={styles.textInputLabel}>
        {label}
      </label>
      <input
        type="text"
        id={`textinput-${name}`}
        placeholder={placeholder}
        className={styles.textInput}
        {...register(name, { required: true })}
        onChange={(e) => {
          if (e.target.value) {
            activateNext();
          } else {
            deactivateNext();
          }
        }}
      />
    </div>
  );
}
