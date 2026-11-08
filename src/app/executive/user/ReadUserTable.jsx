'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { useMemo, useState, useEffect } from 'react';
import * as AdminLayout from '@/app/executive/AdminLayout';
import { roleKorean } from '@/util/constants';

export function ReadUserTable({ users: usersDefault = [], majors = [] }) {
  const t = useTranslations('Executive');
  const roleLabels = t.raw('roles');
  const [filter, setFilter] = useState({
    name: '',
    kakao_name: '',
    role: '',
    status: '',
    major: '',
  });
  const roleLabel = (role) => roleKorean(role);
  const [users, setUsers] = useState(usersDefault);
  useEffect(() => {
    setUsers(usersDefault);
  }, [usersDefault]);
  const filteredUsers = useMemo(() => {
    const lower = (v) => v?.toString().toLowerCase() || '';
    return users.filter((u) => {
      const roleValue = u.role?.toString() ?? '';
      const statusValue = u.is_active ? 'active' : u.is_banned ? 'banned' : 'inactive';
      return (
        (!filter.name || lower(u.name).includes(lower(filter.name))) &&
        (!filter.kakao_name || lower(u.kakao_name).includes(lower(filter.kakao_name))) &&
        (!filter.role ||
          roleValue.includes(filter.role) ||
          lower(roleLabel(u.role)).includes(lower(filter.role)) ||
          lower(roleLabels[u.role]).includes(lower(filter.role))) &&
        (!filter.status || statusValue === filter.status) &&
        (!filter.major || String(u.major_id) === filter.major)
      );
    });
  }, [users, filter, roleLabels]);

  const [saving, setSaving] = useState({});

  const majorsMap = useMemo(
    () => Object.fromEntries(majors.map((m) => [m.id, `${m.college} - ${m.major_name}`])),
    [majors],
  );

  const manualEnroll = async (user) => {
    setSaving((prev) => ({ ...prev, [user.id]: true }));
    try {
      const res = await fetchBackendClient(`/api/executive/user/standby/process/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id }),
      });
      if (res.status === 204) alert(t('depositConfirmed', { value0: String(user.name) }));
      else
        alert(
          t('depositConfirmationFailed', {
            value0: String(user.name),
            value1: String(res.status),
          }),
        );
    } catch (error) {
      console.error(error);
      alert(t('depositConfirmationError', { value0: String(user.name) }));
    } finally {
      setSaving((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  const updateFilter = (field, value) => {
    const nextFilter = { ...filter, [field]: value };
    setFilter(nextFilter);
  };

  return (
    <div>
      <h3>{t('readTable')}</h3>
      <p>{t('readTableDescription')}</p>
      <AdminLayout.AdminTableWrap>
        <AdminLayout.AdminTable>
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('kakaoName')}</th>
              <th>{t('department')}</th>
              <th>{t('role')}</th>
              <th>{t('status')}</th>
              <th>{t('confirmDeposit')}</th>
            </tr>
            <tr>
              <td>
                <AdminLayout.AdminInput
                  value={filter.name}
                  onChange={(e) => updateFilter('name', e.target.value)}
                />
              </td>
              <td>
                <AdminLayout.AdminInput
                  value={filter.kakao_name}
                  onChange={(e) => updateFilter('kakao_name', e.target.value)}
                />
              </td>
              <td>
                <AdminLayout.AdminSelect
                  value={filter.major}
                  onChange={(e) => updateFilter('major', e.target.value)}
                >
                  <option value="">{t('allMajors')}</option>
                  {majors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.college} - {m.major_name}
                    </option>
                  ))}
                </AdminLayout.AdminSelect>
              </td>
              <td>
                <AdminLayout.AdminInput
                  value={filter.role}
                  onChange={(e) => updateFilter('role', e.target.value)}
                />
              </td>
              <td>
                <AdminLayout.AdminSelect
                  value={filter.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                >
                  <option value="">{t('allStatuses')}</option>
                  <option value="active">{t('userStatuses.active')}</option>
                  <option value="inactive">{t('userStatuses.inactive')}</option>
                  <option value="banned">{t('userStatuses.banned')}</option>
                </AdminLayout.AdminSelect>
              </td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const status = user.is_active ? 'active' : user.is_banned ? 'banned' : 'inactive';
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.kakao_name || '-'}</td>
                  <td>{majorsMap[user.major_id] || '-'}</td>
                  <td>{roleLabels[user.role] ?? roleLabel(user.role)}</td>
                  <td>{t(`userStatuses.${status}`)}</td>
                  <td>
                    <AdminLayout.AdminButton
                      variant="secondary"
                      onClick={() => manualEnroll(user)}
                      disabled={saving[user.id]}
                    >
                      {t('confirmDeposit')}
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
