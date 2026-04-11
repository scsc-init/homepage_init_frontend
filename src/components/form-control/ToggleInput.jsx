import styles from './ToggleInput.module.css';

import { Controller } from 'react-hook-form';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';

export default function ToggleInput({ label, name, control }) {
  return (
    <div className={styles.toggleInputGroup}>
      <label htmlFor={`toggleinput-${name}`} className={styles.toggleInputLabel}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ToggleSwitch checked={!!field.value} onChange={field.onChange} />
        )}
      />
    </div>
  );
}
