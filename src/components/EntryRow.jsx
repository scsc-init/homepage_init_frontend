// src/app/executive/EntryRow.jsx (CLIENT)
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';

export default function EntryRow({ entry, onChange, onSave, onDelete, saving }) {
  return (
    <tr key={entry.id}>
      <td className="adm-td">{entry.id}</td>
      <td className="adm-td">
        <input
          className="adm-input"
          value={entry.title}
          onChange={(e) => onChange(entry.id, 'title', e.target.value)}
        />
      </td>
      <td className="adm-td">
        <input
          className="adm-input"
          value={entry.description}
          onChange={(e) => onChange(entry.id, 'description', e.target.value)}
        />
      </td>
      <td className="adm-td">
        <textarea
          className="adm-textarea"
          value={entry.content ?? ''}
          onChange={(e) => onChange(entry.id, 'content', e.target.value)}
        />
      </td>
      <td className="adm-td">
        <select
          className="adm-select"
          value={entry.status}
          onChange={(e) => onChange(entry.id, 'status', e.target.value)}
        >
          <option value="surveying">{STATUS_MAP.surveying}</option>
          <option value="recruiting">{STATUS_MAP.recruiting}</option>
          <option value="active">{STATUS_MAP.active}</option>
          <option value="inactive">{STATUS_MAP.inactive}</option>
        </select>
      </td>
      <td className="adm-td">
        <input
          className="adm-input"
          type="number"
          value={entry.year}
          onChange={(e) => onChange(entry.id, 'year', Number(e.target.value))}
          disabled
        />
      </td>
      <td className="adm-td">
        <select
          className="adm-select"
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
      <td className="adm-td">
        <select className="adm-select">
          {entry.members.map((m) => (
            <option key={m.id}>{m.user.name}</option>
          ))}
        </select>
      </td>
      <td className="adm-td">
        <div className="adm-flex">
          <button
            className="adm-button"
            onClick={() => onSave(entry)}
            disabled={saving[entry.id]}
          >
            저장
          </button>
          <button className="adm-button outline" onClick={() => onDelete(entry.id)}>
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
}
