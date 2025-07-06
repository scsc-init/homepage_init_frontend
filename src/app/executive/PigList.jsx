"use client";

import React, { useState } from "react";
import EntryRow from "./EntryRow.jsx";

export default function PigList({ pigs: pigsDefault }) {
  const [pigs, setPigs] = useState(pigsDefault ?? []);
  const [saving, setSaving] = useState({});

  const handleChange = (id, field, value) => {
    setPigs((prev) =>
      prev.map((pig) => (pig.id === id ? { ...pig, [field]: value } : pig)),
    );
  };

  const handleSave = async (pig) => {
    const jwt = localStorage.getItem("jwt");
    setSaving((prev) => ({ ...prev, [pig.id]: true }));

    const res = await fetch(`/api/executive/pig/${pig.id}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
      body: JSON.stringify({
        title: pig.title,
        description: pig.description,
        content: pig.content,
        status: pig.status,
        year: pig.year,
        semester: pig.semester,
      }),
    });

    if (res.status === 204) {
      alert("저장 완료");
    } else {
      alert("저장 실패: " + res.status);
    }

    setSaving((prev) => ({ ...prev, [pig.id]: false }));
  };

  const handleDelete = async (id) => {
    const jwt = localStorage.getItem("jwt");
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/executive/pig/${id}/delete`, {
      method: "POST",
      headers: { "x-jwt": jwt },
    });

    if (res.status === 204) {
      setPigs((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("삭제 실패: " + res.status);
    }
  };

  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        marginBottom: "2rem",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>이름</th>
          <th style={thStyle}>설명</th>
          <th style={thStyle}>내용</th>
          <th style={thStyle}>상태</th>
          <th style={thStyle}>연도</th>
          <th style={thStyle}>학기</th>
          <th style={thStyle}>작업</th>
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
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f5f5f5",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};
