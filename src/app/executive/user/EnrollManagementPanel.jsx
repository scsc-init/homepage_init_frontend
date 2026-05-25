'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { useEffect, useState } from 'react';
import * as AdminLayout from '@/components/AdminLayout';

function TrxRecord({ record }) {
  return (
    <div>
      <hr />
      <div>입금자명: {record.deposit_name}</div>
      <div>입금시각: {record.deposit_time}</div>
      <div>입금금액: {record.amount}</div>
      <hr />
    </div>
  );
}

export default function EnrollManagementPanel() {
  const [standbys, setStandbys] = useState([]);
  const [results, setResults] = useState([]);
  const [failedCnt, setFailedCnt] = useState(0);

  useEffect(() => {
    const fetchStandbys = async () => {
      const res = await fetchBackendClient(`/api/executive/user/standby/list`);
      if (res.ok) setStandbys(await res.json());
    };
    fetchStandbys();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const res = await fetchBackendClient(`/api/executive/user/standby/process`, {
      method: 'POST',
      body: form,
    });
    if (res.status !== 200) {
      const err = await res.json();
      alert('파일 처리 실패: ' + err.detail);
    } else {
      const enrollData = await res.json();
      setFailedCnt(enrollData.cnt_failed_records);
      setResults(enrollData.results);
    }
  };

  return (
    <div>
      <h2>입금 대기자 목록</h2>
      <AdminLayout.AdminTableWrap>
        <AdminLayout.AdminTable>
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
                <td>{u.deposit_time ?? '(없음)'}</td>
                <td>{u.is_checked ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </AdminLayout.AdminTable>
      </AdminLayout.AdminTableWrap>

      <AdminLayout.AdminSection>
        <h3>CSV 파일 업로드</h3>
        <AdminLayout.AdminActions>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </AdminLayout.AdminActions>
      </AdminLayout.AdminSection>

      {results.length !== 0 && (
        <AdminLayout.AdminSection>
          <div>처리 실패 요청 건수: {failedCnt}건</div>
          {results.map((r, idx) => (
            <AdminLayout.AdminTableWrap
              key={`${r.record?.deposit_time ?? 'unknown'}-${idx}`}
              style={{ padding: '1rem' }}
            >
              <div>{r.result_msg}</div>
              <TrxRecord record={r.record} />
              <div>오류 관련 사용자</div>
              {r.users.map((u) => (
                <div key={u.id}>{`${u.name}(${u.email})`}</div>
              ))}
            </AdminLayout.AdminTableWrap>
          ))}
        </AdminLayout.AdminSection>
      )}
    </div>
  );
}
