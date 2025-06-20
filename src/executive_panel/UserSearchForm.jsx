"use client";

import React, { useState } from "react";

export default function UserSearchForm({ onUserFound }) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("id");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    if (!query.trim()) {
      setError("검색어를 입력해주세요.");
      return;
    }

    if (searchType !== "id") {
      setError("현재는 ID로만 검색할 수 있습니다.");
      return;
    }

    const jwt = localStorage.getItem("jwt");
    try {
      const res = await fetch(`/api/user/${query}`, {
        headers: {
          "x-api-secret": "some-secret-code",
          "x-jwt": jwt,
        },
      });

      if (!res.ok) throw new Error(`(${res.status}) 사용자 조회 실패`);

      const data = await res.json();
      onUserFound(data);
    } catch (err) {
      console.error("검색 실패:", err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>회원 검색</h2>
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        style={{ marginRight: "0.5rem" }}
      >
        <option value="id">ID</option>
        <option value="email" disabled>
          이메일
        </option>
        <option value="name" disabled>
          이름
        </option>
        <option value="student_id" disabled>
          학번
        </option>
      </select>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="사용자 ID 입력"
        style={{ padding: "0.3rem", width: "300px" }}
      />
      <button onClick={handleSearch} style={{ marginLeft: "0.5rem" }}>
        검색
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
