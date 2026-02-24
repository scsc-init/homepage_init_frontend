'use client';

import styles from './board.module.css';
import { PIG_ADMISSION_LABEL_MAP } from '@/util/constants';

const ADMISSION_KEYS = ['always', 'during_recruiting', 'never'];

export default function PigAdmissionDropdown({ pigAdmissionState, setPigAdmissionState }) {
  const value = ADMISSION_KEYS.includes(pigAdmissionState) ? pigAdmissionState : 'always';

  const handleChange = (e) => {
    setPigAdmissionState(e.target.value);
  };

  return (
    <div className={styles.pigAdmissionDropdown}>
      <select className={styles.pigAdmissionSelect} value={value} onChange={handleChange}>
        <option value="always">{PIG_ADMISSION_LABEL_MAP.always}</option>
        <option value="during_recruiting">{PIG_ADMISSION_LABEL_MAP.during_recruiting}</option>
        <option value="never">{PIG_ADMISSION_LABEL_MAP.never}</option>
      </select>
    </div>
  );
}
