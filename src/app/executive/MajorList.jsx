"use client";

import React, { useState } from "react";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export default function MajorList({ majors: majorsDefault }) {
  const [majors, setMajors] = useState(majorsDefault ?? []);
  const [newMajor, setNewMajor] = useState({ college: "", major_name: "" });

  const updateMajorField = (id, field, value) => {
    setMajors((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const saveMajor = async (major) => {
    const res = await fetch(
      `${getBaseUrl()}/api/executive/major/update/${major.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": getApiSecret(),
          "x-jwt": localStorage.getItem("jwt"),
        },
        body: JSON.stringify(major),
      },
    );
    if (res.status === 204) alert("저장 완료");
    else alert("저장 실패: " + res.status);
  };

  const deleteMajor = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(
      `${getBaseUrl()}/api/executive/major/delete/${id}`,
      {
        method: "POST",
        headers: {
          "x-api-secret": getApiSecret(),
          "x-jwt": localStorage.getItem("jwt"),
        },
      },
    );
    if (res.status === 204) {
      alert("삭제 완료");
      setMajors((prev) => prev.filter((m) => m.id !== id));
    } else alert("삭제 실패: " + res.status);
  };

  const createMajor = async () => {
    const res = await fetch(`${getBaseUrl()}/api/executive/major/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": getApiSecret(),
        "x-jwt": localStorage.getItem("jwt"),
      },
      body: JSON.stringify(newMajor),
    });
    if (res.status === 201) {
      alert("추가 완료");
      setNewMajor({ college: "", major_name: "" });
      fetchMajors();
    } else alert("추가 실패: " + res.status);
  };

  return (
    <div>
      <h2>전공 목록</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>대학</th>
            <th style={thStyle}>전공명</th>
            <th style={thStyle}>작업</th>
          </tr>
        </thead>
        <tbody>
          {majors.map((major) => (
            <tr key={major.id}>
              <td style={tdStyle}>{major.id}</td>
              <td style={tdStyle}>
                <input
                  value={major.college}
                  onChange={(e) =>
                    updateMajorField(major.id, "college", e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                <input
                  value={major.major_name}
                  onChange={(e) =>
                    updateMajorField(major.id, "major_name", e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                <button onClick={() => saveMajor(major)}>저장</button>
                <button onClick={() => deleteMajor(major.id)}>삭제</button>
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td>
              <input
                placeholder="대학명"
                value={newMajor.college}
                onChange={(e) =>
                  setNewMajor((prev) => ({ ...prev, college: e.target.value }))
                }
              />
            </td>
            <td>
              <input
                placeholder="전공명"
                value={newMajor.major_name}
                onChange={(e) =>
                  setNewMajor((prev) => ({
                    ...prev,
                    major_name: e.target.value,
                  }))
                }
              />
            </td>
            <td>
              <button onClick={createMajor}>추가</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f5f5f5",
};
const tdStyle = { border: "1px solid #ccc", padding: "8px" };
