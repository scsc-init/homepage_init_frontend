import styles from './ToggleInput.module.css';

import { Controller } from 'react-hook-form';
import { useId, useState } from 'react';
import type { ChangeEvent, ComponentPropsWithoutRef } from 'react';
import type { Control, FieldPathByValue, FieldValues } from 'react-hook-form';

type ToggleSwitchProps = Omit<ComponentPropsWithoutRef<'input'>, 'onChange' | 'type'> & {
  focusDisabled?: boolean;
  onChange?: (checked: boolean) => void;
};

function ToggleSwitch({
  checked,
  value: valueProp,
  focusDisabled,
  onChange,
  ...props
}: ToggleSwitchProps) {
  const isControlled = typeof checked !== 'undefined' || typeof valueProp !== 'undefined';
  const isOn = isControlled ? !!(typeof checked !== 'undefined' ? checked : valueProp) : false;
  const [focus, setFocus] = useState(false);
  const id = useId();

  return (
    <label
      className={`${styles.switch} ${styles.form}`}
      htmlFor={id}
      title={isOn ? '켜짐' : '꺼짐'}
    >
      <input
        id={id}
        type="checkbox"
        checked={isOn}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...props}
      />
      <span
        className={`${styles.slider} ${isOn ? styles.checked : ''} ${!focusDisabled && focus ? styles.focused : ''}`}
        aria-hidden="true"
      />
      <span
        className={`${styles.thumb}`}
        style={{ transform: isOn ? 'translateX(22px)' : 'translateX(0)' }}
        aria-hidden="true"
      />
    </label>
  );
}

type ToggleInputProps<TFieldValues extends FieldValues> = {
  label: string;
  name: FieldPathByValue<TFieldValues, boolean>;
  control: Control<TFieldValues>;
};

export default function ToggleInput<TFieldValues extends FieldValues>({
  label,
  name,
  control,
}: ToggleInputProps<TFieldValues>) {
  const labelId = useId();

  return (
    <div className={styles.toggleInputGroup} key={name}>
      <span id={labelId} className={styles.toggleInputLabel}>
        {label}
      </span>
      <Controller<TFieldValues, FieldPathByValue<TFieldValues, boolean>>
        name={name}
        control={control}
        render={({ field }) => (
          <ToggleSwitch
            aria-labelledby={labelId}
            focusDisabled={true}
            checked={!!field.value}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
}
