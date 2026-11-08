'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { useEffect, useState } from 'react';
import * as AdminLayout from '@/app/executive/AdminLayout';

function TrxRecord({ record }) {
  const t = useTranslations('Executive');
  return (
    <div>
      <hr />
      <div>{t('depositNameValue', { value0: record.deposit_name ?? '' })}</div>
      <div>{t('depositTimeValue', { value0: record.deposit_time ?? '' })}</div>
      <div>{t('depositAmountValue', { value0: record.amount ?? '' })}</div>
      <hr />
    </div>
  );
}

export default function EnrollManagementPanel() {
  const t = useTranslations('Executive');
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
      alert(t('fileFailedPrefix') + err.detail);
    } else {
      const enrollData = await res.json();
      setFailedCnt(enrollData.cnt_failed_records);
      setResults(enrollData.results);
    }
  };

  return (
    <div>
      <h2>{t('pendingDeposits')}</h2>
      <AdminLayout.AdminTableWrap>
        <AdminLayout.AdminTable>
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('depositName')}</th>
              <th>{t('depositTime')}</th>
              <th>{t('checked')}</th>
            </tr>
          </thead>
          <tbody>
            {standbys.map((u) => (
              <tr key={u.standby_user_id}>
                <td>{u.user_name}</td>
                <td>{u.deposit_name}</td>
                <td>{u.deposit_time ?? t('none')}</td>
                <td>{u.is_checked ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </AdminLayout.AdminTable>
      </AdminLayout.AdminTableWrap>

      <AdminLayout.AdminSection>
        <h3>{t('csvUpload')}</h3>
        <AdminLayout.AdminActions>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </AdminLayout.AdminActions>
      </AdminLayout.AdminSection>

      {results.length !== 0 && (
        <AdminLayout.AdminSection>
          <div>{t('failedRequestCount', { value0: failedCnt ?? '' })}</div>
          {results.map((r, idx) => (
            <AdminLayout.AdminTableWrap
              key={`${r.record?.deposit_time ?? 'unknown'}-${idx}`}
              style={{ padding: '1rem' }}
            >
              <div>{r.result_msg}</div>
              <TrxRecord record={r.record} />
              <div>{t('errorUsers')}</div>
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
