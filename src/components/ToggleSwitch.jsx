// src/components/ToggleSwitch.jsx
'use client';

import './ToggleSwitch.css';

export default function ToggleSwitch({ checked, value: valueProp, onChange, ...rest }) {
  const isOn = typeof checked !== 'undefined' ? !!checked : !!valueProp;

  return (
    <label className="switch switch--form" title={isOn ? '켜짐' : '꺼짐'}>
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
