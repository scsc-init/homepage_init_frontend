'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { useEffect, useState } from 'react';
import { utc2kst } from '@/util/constants';
import * as AdminLayout from '@/components/AdminLayout';

export default function OldboyManagementPanel({ users }) {
  const [applicants, setApplicants] = useState([]);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const fetchApplicants = async () => {
      const res = await fetchBackendClient(`/api/executive/user/oldboy/applicants`);
      if (res.ok) setApplicants(await res.json());
    };
    fetchApplicants();
  }, []);

  const processOldboy = async (user) => {
    setSaving((prev) => ({ ...prev, [user.id]: true }));
    const res = await fetchBackendClient(`/api/executive/user/oldboy/${user.id}/process`, {
      method: 'POST',
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
      <AdminLayout.AdminTableWrap>
        <AdminLayout.AdminTable>
          <thead>
            <tr>
              <th>이름</th>
              <th>신청시각</th>
              <th>처리시각</th>
              <th>처리여부</th>
              <th>승인버튼</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((u) => {
              const user = users.find((x) => x.id === u.id);
              const displayName = user?.name ?? '(알 수 없음)';
              return (
                <tr key={u.id}>
                  <td>{displayName}</td>
                  <td>{utc2kst(u.created_at)}</td>
                  <td>{utc2kst(u.updated_at)}</td>
                  <td>{u.processed ? '✅' : '❌'}</td>
                  <td>
                    <AdminLayout.AdminButton
                      onClick={() => user && processOldboy(user)}
                      disabled={!user || Boolean(saving[user.id]) || u.processed}
                    >
                      승인
                    </AdminLayout.AdminButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </AdminLayout.AdminTable>
      </AdminLayout.AdminTableWrap>
    </div>
  );
}
