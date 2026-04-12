'use client';

import styles from './DropdownInput.module.css';

import { Controller } from 'react-hook-form';

export default function DropdownInput({ name, label, options, control }) {
  const ID = `dropdowninput-${name.replaceAll('.', '-')}`;

  return (
    <div className={styles.dropdownInputGroup} key={name}>
      <label htmlFor={ID} className={styles.dropdownInputLabel}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const defaultValue = Object.keys(options).includes(field.value)
            ? field.value
            : Object.keys(options)[0];

          return (
            <select
              id={ID}
              className={styles.dropdownInputSelect}
              value={defaultValue}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {Object.entries(options).map((entry) => {
                return (
                  <option key={entry[0]} value={entry[0]}>
                    {entry[1]}
                  </option>
                );
              })}
            </select>
          );
        }}
      />
    </div>
  );
}
