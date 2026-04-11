'use client';

import styles from './TextInput.module.css';

export default function TextInput({ label, placeholder, register, name }) {
  return (
    <div className={styles.textInputGroup}>
      <label htmlFor={`textinput-${name}`} className={styles.textInputLabel}>
        {label}
      </label>
      <input
        type="text"
        id={`textinput-${name}`}
        placeholder={placeholder}
        className={styles.textInput}
        {...register(name, { required: true })}
      />
    </div>
  );
}
