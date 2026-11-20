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
  errorMessage?: string;
  requiredIndicator?: boolean;
  requiredMessage?: string;
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
  errorMessage,
  requiredIndicator = false,
  requiredMessage,
}: TextInputProps<TFieldValues>) {
  const ID = `textinput-${name.replaceAll('.', '-')}`;

  return (
    <div className={styles.textInputGroup} key={name}>
      <label htmlFor={ID} className={`${styles.textInputLabel} ${labelClassName ?? ''}`.trim()}>
        {label}
        {requiredIndicator ? (
          <span className={styles.requiredMark} aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
        {errorMessage ? (
          <span className={styles.errorMessage} role="alert">
            {' '}
            {errorMessage}
          </span>
        ) : null}
      </label>
      <input
        type="text"
        id={ID}
        placeholder={placeholder}
        className={`${styles.textInput} ${className ?? ''}`.trim()}
        {...register(name, {
          validate: required
            ? (value) => value.trim().length > 0 || (requiredMessage ?? false)
            : undefined,
        })}
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
