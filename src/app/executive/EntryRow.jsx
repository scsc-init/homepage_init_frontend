import React from "react";

export default function EntryRow({
  entry,
  onChange,
  onSave,
  onDelete,
  saving,
}) {
  const tdStyle = {
    border: "1px solid #ccc",
    padding: "8px",
  };

  return (
    <tr key={entry.id}>
      <td style={tdStyle}>{entry.id}</td>
      <td style={tdStyle}>
        <input
          value={entry.title}
          onChange={(e) => onChange(entry.id, "title", e.target.value)}
        />
      </td>
      <td style={tdStyle}>
        <input
          value={entry.description}
          onChange={(e) => onChange(entry.id, "description", e.target.value)}
        />
      </td>
      <td style={tdStyle}>
        <textarea
          value={entry.content ?? ""}
          onChange={(e) => onChange(entry.id, "content", e.target.value)}
        />
      </td>
      <td style={tdStyle}>
        <select
          value={entry.status}
          onChange={(e) => onChange(entry.id, "status", e.target.value)}
        >
          <option value="surveying">설문중</option>
          <option value="recruiting">모집중</option>
          <option value="active">활동중</option>
          <option value="inactive">비활성</option>
        </select>
      </td>
      <td style={tdStyle}>
        <input
          type="number"
          value={entry.year}
          onChange={(e) => onChange(entry.id, "year", parseInt(e.target.value))}
        />
      </td>
      <td style={tdStyle}>
        <select
          value={entry.semester}
          onChange={(e) =>
            onChange(entry.id, "semester", parseInt(e.target.value))
          }
        >
          <option value={1}>1학기</option>
          <option value={2}>2학기</option>
        </select>
      </td>
      <td style={tdStyle}>
        <button onClick={() => onSave(entry)} disabled={saving[entry.id]}>
          저장
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          style={{ marginLeft: "0.5rem" }}
        >
          삭제
        </button>
      </td>
    </tr>
  );
}
