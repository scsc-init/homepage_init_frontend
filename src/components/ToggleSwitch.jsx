'use client';
import styles from './ToggleSwitch.module.css';
import { useId, useState } from 'react';

export default function ToggleSwitch({ checked, value: valueProp, onChange }) {
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
        onChange={(e) => onChange?.(e.target.checked)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <span
        className={`${styles.slider} ${isOn ? styles.checked : ''} ${focus ? styles.focused : ''}`}
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
