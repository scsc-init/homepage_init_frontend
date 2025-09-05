// src/app/executive/EntryRow.jsx (CLIENT)
import React from "react";

export default function EntryRow({
  entry,
  onChange,
  onSave,
  onDelete,
  saving,
}) {
  return (
    <tr key={entry.id}>
      <td className="adm-td">{entry.id}</td>
      <td className="adm-td">
        <input
          className="adm-input"
          value={entry.title}
          onChange={(e) => onChange(entry.id, "title", e.target.value)}
        />
      </td>
      <td className="adm-td">
        <input
          className="adm-input"
          value={entry.description}
          onChange={(e) => onChange(entry.id, "description", e.target.value)}
        />
      </td>
      <td className="adm-td">
        <textarea
          className="adm-textarea"
          value={entry.content ?? ""}
          onChange={(e) => onChange(entry.id, "content", e.target.value)}
        />
      </td>
      <td className="adm-td">
        <select
          className="adm-select"
          value={entry.status}
          onChange={(e) => onChange(entry.id, "status", e.target.value)}
        >
          <option value="surveying">설문중</option>
          <option value="recruiting">모집중</option>
          <option value="active">활동중</option>
          <option value="inactive">비활성</option>
        </select>
      </td>
      <td className="adm-td">
        <input
          className="adm-input"
          type="number"
          value={entry.year}
          onChange={(e) => onChange(entry.id, "year", parseInt(e.target.value))}
        />
      </td>
      <td className="adm-td">
        <select
          className="adm-select"
          value={entry.semester}
          onChange={(e) =>
            onChange(entry.id, "semester", parseInt(e.target.value))
          }
        >
          <option value={1}>1학기</option>
          <option value={2}>S학기</option>
          <option value={3}>2학기</option>
          <option value={4}>W학기</option>
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
          <button
            className="adm-button outline"
            onClick={() => onDelete(entry.id)}
          >
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
}
