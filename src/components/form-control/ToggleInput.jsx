import styles from './ToggleInput.module.css';

import { Controller } from 'react-hook-form';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';

export default function ToggleInput({ label, name, control }) {
  return (
    <div className={styles.toggleInputGroup}>
      <span className={styles.toggleInputLabel}>{label}</span>
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
