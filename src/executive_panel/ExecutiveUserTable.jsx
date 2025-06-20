"use client";

import React, { useEffect, useState } from "react";

export default function ExecutiveUserTable({ onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const jwt = localStorage.getItem("jwt");
      const res = await fetch(
        "http://localhost:8080/api/users?user_role=executive",
        {
          headers: {
            "x-api-secret": "some-secret-code",
            "x-jwt": jwt,
          },
        },
      );
      if (!res.ok) {
        console.error("유저 목록 불러오기 실패", res.status);
        return;
      }
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <h2>전체 회원 목록</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="이름 또는 이메일 검색"
        style={{ marginBottom: "0.5rem", padding: "0.3rem", width: "60%" }}
      />
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        style={{ marginLeft: "1rem", padding: "0.3rem" }}
      >
        <option value="">모든 권한</option>
        <option value="newcomer">준회원</option>
        <option value="member">정회원</option>
        <option value="oldboy">OB</option>
        <option value="executive">운영진</option>
        <option value="president">회장</option>
      </select>
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id} style={{ margin: "0.3rem 0" }}>
            <button onClick={() => onUserSelect(user.id)}>
              {user.name} ({user.email}) - {user.role}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
