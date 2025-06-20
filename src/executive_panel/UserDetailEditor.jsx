"use client";

import React, { useEffect, useState } from "react";

export default function UserDetailEditor({ userId }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const jwt = localStorage.getItem("jwt");
      const res = await fetch(`/api/user/${userId}`, {
        headers: {
          "x-api-secret": "some-secret-code",
          "x-jwt": jwt,
        },
      });
      const data = await res.json();
      setUser(data);
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        student_id: data.student_id || "",
        major_id: data.major_id || "",
        role: roleNumberToString(data.role),
        status: data.status || "active",
      });
    };

    const fetchMajors = async () => {
      const res = await fetch("/api/majors", {
        headers: { "x-api-secret": "some-secret-code" },
      });
      if (res.ok) setMajors(await res.json());
    };

    fetchUser();
    fetchMajors();
  }, [userId]);

  const roleNumberToString = (val) => {
    const map = {
      0: "lowest",
      100: "dormant",
      200: "newcomer",
      300: "member",
      400: "oldboy",
      500: "executive",
      1000: "president",
    };
    return typeof val === "string" ? val : (map[val] ?? "member");
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const jwt = localStorage.getItem("jwt");

    const payload = {
      name: form.name,
      phone: form.phone,
      student_id: form.student_id,
      major_id: Number(form.major_id),
      role: form.role,
      status: form.status,
    };

    const res = await fetch(`/api/executive/user/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": "some-secret-code",
        "x-jwt": jwt,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 204) {
      alert("수정 완료");
    } else {
      alert("수정 실패: " + res.status);
    }
  };

  if (!user || !form) return <p>로딩 중...</p>;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>{user.name} 상세 정보 수정</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          <tr>
            <th style={thStyle}>이름</th>
            <td style={tdStyle}>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th style={thStyle}>전화번호</th>
            <td style={tdStyle}>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th style={thStyle}>학번</th>
            <td style={tdStyle}>
              <input
                value={form.student_id}
                onChange={(e) => handleChange("student_id", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th style={thStyle}>학과</th>
            <td style={tdStyle}>
              <select
                value={form.major_id}
                onChange={(e) => handleChange("major_id", e.target.value)}
              >
                <option value="">전공 선택</option>
                {majors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.college} - {m.major_name}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th style={thStyle}>권한</th>
            <td style={tdStyle}>
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                <option value="president">회장</option>
                <option value="executive">운영진</option>
                <option value="member">정회원</option>
                <option value="oldboy">졸업생</option>
                <option value="newcomer">준회원</option>
                <option value="dormant">휴회원</option>
                <option value="lowest">최저권한</option>
              </select>
            </td>
          </tr>
          <tr>
            <th style={thStyle}>상태</th>
            <td style={tdStyle}>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="active">active</option>
                <option value="pending">pending</option>
                <option value="banned">banned</option>
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ textAlign: "right", padding: "1rem 0" }}>
              <button onClick={handleSubmit}>저장</button>
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
  textAlign: "left",
  background: "#f5f5f5",
  width: "25%",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};
