'use client';

import { useLocale, useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { useEffect, useState } from 'react';
import { formatExecutiveDate } from '@/app/executive/formatExecutiveDate';
import * as AdminLayout from '@/app/executive/AdminLayout';

export default function OldboyManagementPanel({ users }) {
  const t = useTranslations('Executive');
  const locale = useLocale();
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
    if (res.status === 204) alert(t('alumniApproved', { value0: String(user.name) }));
    else {
      const err = await res.json();
      alert(
        t('alumniApprovalFailed', {
          value0: String(user.name),
          value1: String(res.status),
          value2: String(err.detail ?? err),
        }),
      );
    }
    setSaving((prev) => ({ ...prev, [user.id]: false }));
  };

  return (
    <div>
      <h2>{t('alumniApplications')}</h2>
      <AdminLayout.AdminTableWrap>
        <AdminLayout.AdminTable>
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('requestedAt')}</th>
              <th>{t('processedAt')}</th>
              <th>{t('processed')}</th>
              <th>{t('approval')}</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((u) => {
              const user = users.find((x) => x.id === u.id);
              const displayName = user?.name ?? t('unknown');
              return (
                <tr key={u.id}>
                  <td>{displayName}</td>
                  <td>{formatExecutiveDate(u.created_at, locale)}</td>
                  <td>{formatExecutiveDate(u.updated_at, locale)}</td>
                  <td>{u.processed ? '✅' : '❌'}</td>
                  <td>
                    <AdminLayout.AdminButton
                      onClick={() => user && processOldboy(user)}
                      disabled={!user || Boolean(saving[user.id]) || u.processed}
                    >
                      {t('approve')}
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
