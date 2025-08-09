"use client";

import { useEffect, useState } from "react";

function TrxRecord({ record }) {
  return <div>
    <hr></hr>
    <div>입금자명: {record.deposit_name}</div>
    <div>입금시각: {record.deposit_time}</div>
    <div>입금금액: {record.amount}</div>
    <hr></hr>
  </div>
}

export default function EnrollManageMentPanel() {
  const [standbys, setStandbys] = useState([]);
  const [results, setResults] = useState([]);
  const [failedCnt, setFailedCnt] = useState(0);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const fetchStandbys = async () => {
      const res = await fetch(`/api/executive/user/standby/list`, {
        headers: { "x-jwt": jwt },
      });
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

    const res = await fetch(`/api/executive/user/standby/process`, {
      method: "POST",
      headers: { "x-jwt": jwt },
      body: form,
    });

    if (res.status !== 200) {
      alert("파일 처리 실패: " + (await res.json()).detail);
    } else {
      const enrollData = await res.json();
      console.log(enrollData.results);
      setFailedCnt(enrollData.cnt_failed_records);
      setResults(enrollData.results);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>입금 대기자 목록</h2>
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
      {results.length !== 0 && (
        <>
          <div>처리 실패 요청 건수: {failedCnt}건</div>
          {results.map((r) => (
            <div key={r.record.deposit_time}>
              <hr></hr>
              <div>{r.result_msg}</div>
              <TrxRecord record={r.record}/>
              <div>오류 관련 사용자</div>
              {r.users.map((u) => (
                <div key={u.id}>{u.name+'('+u.email+')'}</div>
              ))}
              <hr></hr>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
