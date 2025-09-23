"use client";
import React, { useState } from "react";
import EntryRow from "./EntryRow.jsx";

export default function PigList({ pigs: pigsDefault }) {
  const [pigs, setPigs] = useState(pigsDefault ?? []);
  const [saving, setSaving] = useState({});

  const handleChange = (id, field, value) => {
    setPigs((prev) => prev.map((pig) => (pig.id === id ? { ...pig, [field]: value } : pig)));
  };

  const handleSave = async (pig) => {
    setSaving((prev) => ({ ...prev, [pig.id]: true }));
    const res = await fetch(`/api/executive/pig/${pig.id}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: pig.title,
        description: pig.description,
        content: pig.content,
        status: pig.status,
        year: pig.year,
        semester: pig.semester,
      }),
    });
    if (res.status === 204) alert('저장 완료');
    else alert('저장 실패: ' + res.status);
    setSaving((prev) => ({ ...prev, [pig.id]: false }));
  };

  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/executive/pig/${id}/delete`, {
      method: "POST",
    });
    if (res.status === 204) setPigs((prev) => prev.filter((p) => p.id !== id));
    else alert('삭제 실패: ' + res.status);
  };

  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead>
          <tr>
            <th className="adm-th">ID</th>
            <th className="adm-th">이름</th>
            <th className="adm-th">설명</th>
            <th className="adm-th">내용</th>
            <th className="adm-th">상태</th>
            <th className="adm-th">연도</th>
            <th className="adm-th">학기</th>
            <th className="adm-th">작업</th>
          </tr>
        </thead>
        <tbody>
          {pigs.map((pig) => (
            <EntryRow
              key={pig.id}
              entry={pig}
              onChange={handleChange}
              onSave={handleSave}
              onDelete={handleDelete}
              saving={saving}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
