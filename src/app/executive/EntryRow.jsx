// src/app/executive/EntryRow.jsx (CLIENT)
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';
import styles from './igpage.module.css';

export default function EntryRow({ entry, onChange, onSave, onDelete, saving }) {
  const renderBooleanCell = (field, label, value) => {
    const checked = Boolean(value);
    return (
      <td className={styles['adm-td']}>
        <label className={styles['adm-flex']}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(entry.id, field, e.target.checked)}
            aria-label={label}
          />
          <span>{checked ? '예' : '아니오'}</span>
        </label>
      </td>
    );
  };

  return (
    <tr key={entry.id}>
      <td className={styles['adm-td']}>{entry.id}</td>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={entry.title}
          onChange={(e) => onChange(entry.id, 'title', e.target.value)}
        />
      </td>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={entry.description}
          onChange={(e) => onChange(entry.id, 'description', e.target.value)}
        />
      </td>
      <td className={styles['adm-td']}>
        <textarea
          className={styles['adm-textarea']}
          value={entry.content ?? ''}
          onChange={(e) => onChange(entry.id, 'content', e.target.value)}
        />
      </td>
      <td className={styles['adm-td']}>
        <select
          className={styles['adm-select']}
          value={entry.status}
          onChange={(e) => onChange(entry.id, 'status', e.target.value)}
        >
          <option value="recruiting">{STATUS_MAP.recruiting}</option>
          <option value="active">{STATUS_MAP.active}</option>
          <option value="inactive">{STATUS_MAP.inactive}</option>
        </select>
      </td>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          type="number"
          value={entry.year}
          onChange={(e) => onChange(entry.id, 'year', Number(e.target.value))}
          disabled
        />
      </td>
      <td className={styles['adm-td']}>
        <select
          className={styles['adm-select']}
          value={entry.semester}
          onChange={(e) => onChange(entry.id, 'semester', Number(e.target.value))}
          disabled
        >
          <option value={1}>{SEMESTER_MAP[1]}학기</option>
          <option value={2}>{SEMESTER_MAP[2]}학기</option>
          <option value={3}>{SEMESTER_MAP[3]}학기</option>
          <option value={4}>{SEMESTER_MAP[4]}학기</option>
        </select>
      </td>
      {renderBooleanCell('should_extend', '다음 학기 연장 신청', entry.should_extend)}
      {renderBooleanCell('is_rolling_admission', '가입기간 자유화', entry.is_rolling_admission)}
      <td className={styles['adm-td']}>
        <select className={styles['adm-select']}>
          {entry.members.map((m) => (
            <option key={m.id}>{m.user.name}</option>
          ))}
        </select>
      </td>
      <td className={styles['adm-td']}>
        <div className={styles['adm-flex']}>
          <button
            className={styles['adm-button']}
            onClick={() => onSave(entry)}
            disabled={saving[entry.id]}
          >
            저장
          </button>
          <button
            className={`${styles['adm-button']} ${styles['outline']}`}
            onClick={() => onDelete(entry.id)}
          >
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
}
