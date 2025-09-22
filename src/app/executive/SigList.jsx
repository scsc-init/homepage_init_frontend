// src/app/executive/SigList.jsx (CLIENT)
'use client';
import React, { useState } from 'react';
import EntryRow from './EntryRow.jsx';

export default function SigList({ sigs: sigsDefault }) {
  const [sigs, setSigs] = useState(sigsDefault ?? []);
  const [saving, setSaving] = useState({});

  const handleChange = (id, field, value) => {
    setSigs((prev) => prev.map((sig) => (sig.id === id ? { ...sig, [field]: value } : sig)));
  };

  const handleSave = async (sig) => {
    const jwt = localStorage.getItem('jwt');
    setSaving((prev) => ({ ...prev, [sig.id]: true }));
    const res = await fetch(`/api/executive/sig/${sig.id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-jwt': jwt },
      body: JSON.stringify({
        title: sig.title,
        description: sig.description,
        content: sig.content,
        status: sig.status,
        year: sig.year,
        semester: sig.semester,
      }),
    });
    if (res.status === 204) alert('저장 완료');
    else alert('저장 실패: ' + res.status);
    setSaving((prev) => ({ ...prev, [sig.id]: false }));
  };

  const handleDelete = async (id) => {
    const jwt = localStorage.getItem('jwt');
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/executive/sig/${id}/delete`, {
      method: 'POST',
      headers: { 'x-jwt': jwt },
    });
    if (res.status === 204) setSigs((prev) => prev.filter((s) => s.id !== id));
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
          {sigs.map((sig) => (
            <EntryRow
              key={sig.id}
              entry={sig}
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
