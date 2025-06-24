"use client";

import React, { useEffect, useState } from "react";
import { getBaseUrl } from "@/util/getBaseUrl";

export default function SigList() {
  const [sigs, setSigs] = useState([]);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const fetchSigs = async () => {
      const jwt = localStorage.getItem("jwt");
      const res = await fetch(`${getBaseUrl()}/api/sigs`, {
        headers: {
          "x-api-secret": "some-secret-code",
          "x-jwt": jwt,
        },
      });

      if (!res.ok) return;

      const sigsRaw = await res.json();

      const sigsWithContent = await Promise.all(
        sigsRaw.map(async (sig) => {
          const articleRes = await fetch(
            `${getBaseUrl()}/api/article/${sig.content_id}`,
            {
              headers: {
                "x-api-secret": "some-secret-code",
              },
            },
          );
          const article = articleRes.ok
            ? await articleRes.json()
            : { content: "" };
          return { ...sig, content: article.content };
        }),
      );

      setSigs(sigsWithContent);
    };

    fetchSigs();
  }, []);

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
          "x-api-secret": "some-secret-code",
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
        "x-api-secret": "some-secret-code",
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
          <tr key={sig.id}>
            <td style={tdStyle}>{sig.id}</td>
            <td style={tdStyle}>
              <input
                value={sig.title}
                onChange={(e) => handleChange(sig.id, "title", e.target.value)}
              />
            </td>
            <td style={tdStyle}>
              <input
                value={sig.description}
                onChange={(e) =>
                  handleChange(sig.id, "description", e.target.value)
                }
              />
            </td>
            <td style={tdStyle}>
              <textarea
                value={sig.content}
                onChange={(e) =>
                  handleChange(sig.id, "content", e.target.value)
                }
              />
            </td>
            <td style={tdStyle}>
              <select
                value={sig.status}
                onChange={(e) => handleChange(sig.id, "status", e.target.value)}
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
                value={sig.year}
                onChange={(e) =>
                  handleChange(sig.id, "year", parseInt(e.target.value))
                }
              />
            </td>
            <td style={tdStyle}>
              <select
                value={sig.semester}
                onChange={(e) =>
                  handleChange(sig.id, "semester", parseInt(e.target.value))
                }
              >
                <option value={1}>1학기</option>
                <option value={2}>2학기</option>
              </select>
            </td>
            <td style={tdStyle}>
              <button onClick={() => handleSave(sig)} disabled={saving[sig.id]}>
                저장
              </button>
              <button
                onClick={() => handleDelete(sig.id)}
                style={{ marginLeft: "0.5rem" }}
              >
                삭제
              </button>
            </td>
          </tr>
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
