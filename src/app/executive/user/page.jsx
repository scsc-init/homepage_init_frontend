// src/app/executive/user/page.jsx
"use client";

import { useEffect, useState } from "react";
import WithAuthorization from "@/components/WithAuthorization";
import UserList from "@/app/executive/UserList";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export default function ExecutiveUserPage() {
  const [standbys, setStandbys] = useState([]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const fetchStandbys = async () => {
      const res = await fetch(
        `${getBaseUrl()}/api/executive/user/standby/list`,
        {
          headers: {
            "x-api-secret": getApiSecret(),
            "x-jwt": jwt,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setStandbys(data);
      }
    };

    fetchStandbys();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const jwt = localStorage.getItem("jwt");
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(
      `${getBaseUrl()}/api/executive/user/standby/process`,
      {
        method: "POST",
        headers: { "x-api-secret": getApiSecret(), "x-jwt": jwt },
        body: form,
      },
    );

    if (res.status === 204) {
      alert("파일 업로드 및 처리 성공");
    } else {
      alert("파일 처리 실패: " + res.status);
    }
  };

  return (
    <WithAuthorization>
      <div style={{ padding: "2rem" }}>
        <h2>유저 관리</h2>
        <UserList />

        <h2 style={{ marginTop: "2rem" }}>입금 대기자 목록</h2>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>이름</th>
              <th>입금자명</th>
              <th>입금시각</th>
              <th>확인여부</th>
            </tr>
          </thead>
          <tbody>
            {standbys.map((u) => (
              <tr key={u.standby_user_id}>
                <td>{u.user_name}</td>
                <td>{u.deposit_name}</td>
                <td>{u.deposit_time ?? "(없음)"}</td>
                <td>{u.is_checked ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "2rem" }}>
          <h3>CSV 파일 업로드</h3>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </div>
      </div>
    </WithAuthorization>
  );
}
