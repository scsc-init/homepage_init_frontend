// src/components/ToggleSwitch.jsx
'use client';

import './ToggleSwitch.css';

export default function ToggleSwitch({
  checked,
  value: valueProp,
  onChange,
  className = '',
  ...rest
}) {
  const isOn = typeof checked !== 'undefined' ? !!checked : !!valueProp;
  const labelClass = ['switch switch--form', className].filter(Boolean).join(' ');

  return (
    <label className={labelClass} title={isOn ? '켜짐' : '꺼짐'}>
      <input
        type="checkbox"
        checked={isOn}
        onChange={(e) => onChange?.(e.target.checked)}
        {...rest}
      />
      <span className="slider" aria-hidden="true" />
    </label>
  );
}
