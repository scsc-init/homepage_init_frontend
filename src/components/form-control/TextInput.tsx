'use client';

import styles from './TextInput.module.css';
import type { KeyboardEvent } from 'react';
import type { FieldPathByValue, FieldValues, UseFormRegister } from 'react-hook-form';

type TextInputProps<TFieldValues extends FieldValues> = {
  label: string;
  placeholder?: string;
  register: UseFormRegister<TFieldValues>;
  name: FieldPathByValue<TFieldValues, string>;
  onEnter?: () => void;
  required?: boolean;
  className?: string;
  labelClassName?: string;
};

export default function TextInput<TFieldValues extends FieldValues>({
  label,
  placeholder,
  register,
  name,
  onEnter,
  required = true,
  className,
  labelClassName,
}: TextInputProps<TFieldValues>) {
  const ID = `textinput-${name.replaceAll('.', '-')}`;

  return (
    <div className={styles.textInputGroup} key={name}>
      <label htmlFor={ID} className={`${styles.textInputLabel} ${labelClassName ?? ''}`.trim()}>
        {label}
      </label>
      <input
        type="text"
        id={ID}
        placeholder={placeholder}
        className={`${styles.textInput} ${className ?? ''}`.trim()}
        {...register(name, { required })}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.nativeEvent?.isComposing) return;
          if (e.key === 'Enter') {
            onEnter?.();
            e.preventDefault();
          }
        }}
      />
    </div>
  );
}
