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
  onEnter,
}) {
  const ID = `textinput-${name.replaceAll('.', '-')}`;

  useEffect(() => {
    const value = document.querySelector(`#${ID}`).value;
    if (value) {
      activateNext(value);
    } else {
      deactivateNext(value);
    }
  }, [activePageIndex]);

  return (
    <div className={styles.textInputGroup} key={name}>
      <label htmlFor={ID} className={styles.textInputLabel}>
        {label}
      </label>
      <input
        type="text"
        id={ID}
        placeholder={placeholder}
        className={styles.textInput}
        {...register(name, { required: true })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onEnter();
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          const value = e.target.value;

          if (value) {
            activateNext(value);
          } else {
            deactivateNext(value);
          }
        }}
      />
    </div>
  );
}
