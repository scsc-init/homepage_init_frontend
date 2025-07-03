"use client";

import React, { useEffect, useState } from "react";
import { getBaseUrl } from "@/util/getBaseUrl";
import EntryRow from "./EntryRow.jsx";
import { getApiSecret } from "@/util/getApiSecret";

export default function PigList() {
  const [pigs, setPigs] = useState([]);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const fetchPigs = async () => {
      const jwt = localStorage.getItem("jwt");
      const res = await fetch(`${getBaseUrl()}/api/pigs`, {
        headers: {
          "x-api-secret": getApiSecret(),
          "x-jwt": jwt,
        },
      });

      if (!res.ok) return;

      const pigsRaw = await res.json();

      const pigsWithContent = await Promise.all(
        pigsRaw.map(async (pig) => {
          const articleRes = await fetch(
            `${getBaseUrl()}/api/article/${pig.content_id}`,
            {
              headers: {
                "x-api-secret": getApiSecret(),
              },
            },
          );
          const article = articleRes.ok
            ? await articleRes.json()
            : { content: "" };
          return { ...pig, content: article.content };
        }),
      );

      setPigs(pigsWithContent);
    };

    fetchPigs();
  }, []);

  const handleChange = (id, field, value) => {
    setPigs((prev) =>
      prev.map((pig) => (pig.id === id ? { ...pig, [field]: value } : pig)),
    );
  };

  const handleSave = async (pig) => {
    const jwt = localStorage.getItem("jwt");
    setSaving((prev) => ({ ...prev, [pig.id]: true }));

    const res = await fetch(
      `${getBaseUrl()}/api/executive/pig/${pig.id}/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": getApiSecret(),
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
      },
    );

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

    const res = await fetch(`${getBaseUrl()}/api/executive/pig/${id}/delete`, {
      method: "POST",
      headers: {
        "x-api-secret": getApiSecret(),
        "x-jwt": jwt,
      },
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
