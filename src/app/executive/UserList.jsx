"use client";

import React, { useEffect, useState } from "react";
import { getBaseUrl } from "@/util/getBaseUrl";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [majors, setMajors] = useState([]);
  const [saving, setSaving] = useState({});
  const [filter, setFilter] = useState({
    name: "",
    phone: "",
    student_id: "",
    role: "",
    status: "",
    major: "",
  });

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    const fetchUsersByRoles = async () => {
      const roles = [
        "lowest",
        "dormant",
        "newcomer",
        "member",
        "oldboy",
        "executive",
        "president",
      ];
      const all = await Promise.all(
        roles.map(async (role) => {
          const res = await fetch(
            `${getBaseUrl()}/api/users?user_role=${role}`,
            {
              headers: { "x-api-secret": "some-secret-code", "x-jwt": jwt },
            }
          );
          return res.ok ? await res.json() : [];
        })
      );
      const result = all.flat();
      const resultUnique = Array.from(
        new Map(result.map((user) => [user.id, user])).values()
      );
      setUsers(resultUnique);
      setFilteredUsers(resultUnique);
    };

    const fetchMajors = async () => {
      const res = await fetch(`${getBaseUrl()}/api/majors`, {
        headers: { "x-api-secret": "some-secret-code" },
      });
      if (res.ok) setMajors(await res.json());
    };

    fetchUsersByRoles();
    fetchMajors();
  }, []);

  const updateUserField = (userId, field, value) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, [field]: value } : u))
    );
    setFilteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, [field]: value } : u))
    );
  };

  const updateFilterCriteria = (field, value) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);
    const lower = (v) => v?.toString().toLowerCase() || "";
    const matches = (u) =>
      (!newFilter.name || lower(u.name).includes(lower(newFilter.name))) &&
      (!newFilter.phone || lower(u.phone).includes(lower(newFilter.phone))) &&
      (!newFilter.student_id ||
        lower(u.student_id).includes(lower(newFilter.student_id))) &&
      (!newFilter.role || lower(u.role).includes(lower(newFilter.role))) &&
      (!newFilter.status ||
        lower(u.status).includes(lower(newFilter.status))) &&
      (!newFilter.major ||
        lower(u.major_id).toString() === newFilter.major);

    setFilteredUsers(users.filter(matches));
  };

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
    return typeof val === "string" ? val : map[val] ?? "member";
  };

  const sendUserData = async (user) => {
    const jwt = localStorage.getItem("jwt");
    setSaving((prev) => ({ ...prev, [user.id]: true }));

    const updated = {
      name: user.name?.trim() || "이름없음",
      phone: user.phone?.trim() || "01000000000",
      student_id: user.student_id?.trim() || "202500000",
      major_id: user.major_id ? Number(user.major_id) : 1,
      role: roleNumberToString(user.role),
      status: user.status || "active",
    };

    const res = await fetch(
      `${getBaseUrl()}/api/executive/user/${user.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": "some-secret-code",
          "x-jwt": jwt,
        },
        body: JSON.stringify(updated),
      }
    );

    if (res.status === 204) alert(`${user.name} 저장 완료`);
    else alert(`${user.name} 저장 실패: ${res.status}`);

    setSaving((prev) => ({ ...prev, [user.id]: false }));
    console.log("PAYLOAD SENT TO SERVER", updated);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>관리자 권한 편집</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={thStyle}>이름</th>
            <th style={thStyle}>학과</th>
            <th style={thStyle}>전화번호</th>
            <th style={thStyle}>학번</th>
            <th style={thStyle}>권한</th>
            <th style={thStyle}>상태</th>
            <th style={thStyle}>저장</th>
          </tr>
          <tr>
            <td style={tdStyle}>
              <input
                value={filter.name}
                onChange={(e) => updateFilterCriteria("name", e.target.value)}
              />
            </td>
            <td style={tdStyle}>
              <select
                value={filter.major}
                onChange={(e) => updateFilterCriteria("major", e.target.value)}
              >
                <option value="">전공 전체</option>
                {majors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.college} - {m.major_name}
                  </option>
                ))}
              </select>
            </td>
            <td style={tdStyle}>
              <input
                value={filter.phone}
                onChange={(e) => updateFilterCriteria("phone", e.target.value)}
              />
            </td>
            <td style={tdStyle}>
              <input
                value={filter.student_id}
                onChange={(e) =>
                  updateFilterCriteria("student_id", e.target.value)
                }
              />
            </td>
            <td style={tdStyle}>
              <input
                value={filter.role}
                onChange={(e) => updateFilterCriteria("role", e.target.value)}
              />
            </td>
            <td style={tdStyle}>
              <input
                value={filter.status}
                onChange={(e) => updateFilterCriteria("status", e.target.value)}
              />
            </td>
            <td style={tdStyle}></td>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td style={tdStyle}>
                <input
                  value={user.name}
                  onChange={(e) =>
                    updateUserField(user.id, "name", e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                <select
                  value={user.major_id}
                  onChange={(e) =>
                    updateUserField(user.id, "major_id", Number(e.target.value))
                  }
                >
                  <option value="">전공 선택</option>
                  {majors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.college} - {m.major_name}
                    </option>
                  ))}
                </select>
              </td>
              <td style={tdStyle}>
                <input
                  value={user.phone || ""}
                  onChange={(e) =>
                    updateUserField(user.id, "phone", e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                <input
                  value={user.student_id || ""}
                  onChange={(e) =>
                    updateUserField(user.id, "student_id", e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                <select
                  value={roleNumberToString(user.role)}
                  onChange={(e) =>
                    updateUserField(user.id, "role", e.target.value)
                  }
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
              <td style={tdStyle}>
                <select
                  value={user.status}
                  onChange={(e) =>
                    updateUserField(user.id, "status", e.target.value)
                  }
                >
                  <option value="active">active</option>
                  <option value="pending">pending</option>
                  <option value="banned">banned</option>
                </select>
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => sendUserData(user)}
                  disabled={saving[user.id]}
                >
                  저장
                </button>
              </td>
            </tr>
          ))}
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
