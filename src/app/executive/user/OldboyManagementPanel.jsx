// src/app/executive/user/OldboyManagementPanel.jsx (CLIENT)
'use client';
import { useEffect, useState } from 'react';

export default function OldboyManagementPanel({ users }) {
  const [applicants, setApplicants] = useState([]);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return;
    const fetchApplicants = async () => {
      const res = await fetch(`/api/executive/user/oldboy/applicants`, {
        headers: { 'x-jwt': jwt },
      });
      if (res.ok) setApplicants(await res.json());
    };
    fetchApplicants();
  }, []);

  const processOldboy = async (user) => {
    const jwt = localStorage.getItem('jwt');
    setSaving((prev) => ({ ...prev, [user.id]: true }));
    const res = await fetch(`/api/executive/user/oldboy/${user.id}/process`, {
      method: 'POST',
      headers: { 'x-jwt': jwt },
    });
    if (res.status === 204) alert(`${user.name} 졸업생 전환 승인 완료`);
    else {
      const err = await res.json();
      alert(`${user.name} 승인 실패: ${res.status};${err.detail ?? err}`);
    }
    setSaving((prev) => ({ ...prev, [user.id]: false }));
  };

  return (
    <div>
      <h2>졸업생 전환 신청자 목록</h2>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th className="adm-th">이름</th>
              <th className="adm-th">신청시각</th>
              <th className="adm-th">처리시각</th>
              <th className="adm-th">처리여부</th>
              <th className="adm-th">승인버튼</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((u) => {
              const user = users.find((x) => x.id === u.id);
              const displayName = user?.name ?? '(알 수 없음)';
              return (
                <tr key={u.id}>
                  <td className="adm-td">{displayName}</td>
                  <td className="adm-td">{u.created_at}</td>
                  <td className="adm-td">{u.updated_at}</td>
                  <td className="adm-td">{u.processed ? '✅' : '❌'}</td>
                  <td className="adm-td">
                    <button
                      className="adm-button"
                      onClick={() => user && processOldboy(user)}
                      disabled={saving[user.id] || u.processed || !user}
                    >
                      승인
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
