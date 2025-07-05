"use client";

import React, { useState } from "react";
import { getBaseUrl } from "@/util/getBaseUrl";
import EntryRow from "./EntryRow.jsx";
import { getApiSecret } from "@/util/getApiSecret";

export default function SigList({ sigs: sigsDefault }) {
  const [sigs, setSigs] = useState(sigsDefault ?? []);
  const [saving, setSaving] = useState({});

  const handleChange = (id, field, value) => {
    setSigs((prev) =>
      prev.map((sig) => (sig.id === id ? { ...sig, [field]: value } : sig)),
    );
  };

  const handleSave = async (sig) => {
    const jwt = localStorage.getItem("jwt");
    setSaving((prev) => ({ ...prev, [sig.id]: true }));

    const res = await fetch(
      `${getBaseUrl()}/api/executive/sig/${sig.id}/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": getApiSecret(),
          "x-jwt": jwt,
        },
        body: JSON.stringify({
          title: sig.title,
          description: sig.description,
          content: sig.content,
          status: sig.status,
          year: sig.year,
          semester: sig.semester,
        }),
      },
    );

    if (res.status === 204) {
      alert("저장 완료");
    } else {
      alert("저장 실패: " + res.status);
    }

    setSaving((prev) => ({ ...prev, [sig.id]: false }));
  };

  const handleDelete = async (id) => {
    const jwt = localStorage.getItem("jwt");
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch(`${getBaseUrl()}/api/executive/sig/${id}/delete`, {
      method: "POST",
      headers: {
        "x-api-secret": getApiSecret(),
        "x-jwt": jwt,
      },
    });

    if (res.status === 204) {
      setSigs((prev) => prev.filter((s) => s.id !== id));
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
