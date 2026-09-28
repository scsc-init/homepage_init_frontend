'use client';

import styles from './DropdownInput.module.css';

import { Controller } from 'react-hook-form';
import type { Control, FieldPathByValue, FieldPathValue, FieldValues } from 'react-hook-form';

type DropdownInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<TFieldValues, string>,
> = {
  name: TName;
  label: string;
  options: Record<FieldPathValue<TFieldValues, TName> & string, string>;
  control: Control<TFieldValues>;
};

export default function DropdownInput<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<TFieldValues, string>,
>({ name, label, options, control }: DropdownInputProps<TFieldValues, TName>) {
  const ID = `dropdowninput-${name.replaceAll('.', '-')}`;
  const optionKeys = Object.keys(options) as Array<
    FieldPathValue<TFieldValues, TName> & string
  >;
  const firstOption = optionKeys[0];

  if (firstOption === undefined) {
    throw new Error('DropdownInput requires at least one option.');
  }

  return (
    <div className={styles.dropdownInputGroup} key={name}>
      <label htmlFor={ID} className={styles.dropdownInputLabel}>
        {label}
      </label>
      <Controller<TFieldValues, TName>
        name={name}
        control={control}
        defaultValue={firstOption}
        render={({ field }) => {
          const fieldValue = field.value;
          const defaultValue = optionKeys.includes(fieldValue) ? fieldValue : firstOption;

          return (
            <select
              id={ID}
              className={styles.dropdownInputSelect}
              value={defaultValue}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {optionKeys.map((option) => {
                return (
                  <option key={option} value={option}>
                    {options[option]}
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
