'use client';

import styles from './TextInput.module.css';

export default function TextInput({ label, placeholder, register, name, onEnter }) {
  const ID = `textinput-${name.replaceAll('.', '-')}`;

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
            onEnter?.();
            e.preventDefault();
          }
        }}
      />
    </div>
  );
}
