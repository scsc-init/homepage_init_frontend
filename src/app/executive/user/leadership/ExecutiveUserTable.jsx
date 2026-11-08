'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { useMemo, useState, useEffect } from 'react';
import * as AdminLayout from '@/app/executive/AdminLayout';
import ExportUsersButton from '../ExportUsersButton';
import { roleEnglish, ROLE_OPTIONS } from '@/util/constants';

export function ExecutiveUserTable({ users: usersDefault = [], majors = [], onShowDetail }) {
  const t = useTranslations('Executive');
  const [users, setUsers] = useState(usersDefault ?? []);

  useEffect(() => {
    setUsers(usersDefault ?? []);
  }, [usersDefault]);
  const [saving, setSaving] = useState({});
  const [filter, setFilter] = useState({
    name: '',
    kakao_name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    student_id: '',
    role: '',
    status: '',
    major: '',
  });
  const filteredUsers = useMemo(() => {
    const lower = (v) => v?.toString().toLowerCase() || '';
    return users.filter((u) => {
      const status = u.is_active ? 'active' : u.is_banned ? 'banned' : 'inactive';
      return (
        (!filter.name || lower(u.name).includes(lower(filter.name))) &&
        (!filter.kakao_name || lower(u.kakao_name).includes(lower(filter.kakao_name))) &&
        (!filter.phone || lower(u.phone).includes(lower(filter.phone))) &&
        (!filter.student_id || lower(u.student_id).includes(lower(filter.student_id))) &&
        (!filter.role || String(u.role) === filter.role) &&
        (!filter.status || status === filter.status) &&
        (!filter.major || lower(u.major_id).toString() === filter.major)
      );
    });
  }, [users, filter]);

  const updateUserField = (userId, field, value) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, [field]: value } : u)));
  };

  const updateUserStatus = (userId, value) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, is_active: value === 'active', is_banned: value === 'banned' }
          : u,
      ),
    );
  };

  const updateFilterCriteria = (field, value) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);
  };

  const roleNumberToString = (val) => (typeof val === 'string' ? val : roleEnglish(val));

  const sendUserData = async (user) => {
    setSaving((prev) => ({ ...prev, [user.id]: true }));
    const updated = {
      name: user.name?.trim(),
      phone: user.phone?.trim(),
      student_id: user.student_id?.trim(),
      major_id: user.major_id ? Number(user.major_id) : undefined,
      role: roleNumberToString(user.role),
      is_active: user.is_active,
      is_banned: user.is_banned,
    };
    const res = await fetchBackendClient(`/api/executive/user/${user.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.status === 204) alert(t('userSaved', { value0: String(user.name) }));
    else alert(t('userSaveFailed', { value0: String(user.name), value1: String(res.status) }));
    setSaving((prev) => ({ ...prev, [user.id]: false }));
  };

  const showDetail = (user) => {
    if (typeof onShowDetail === 'function') {
      onShowDetail(user);
      return;
    }
    try {
      console.info(`User detail (${user.name}):`, JSON.stringify(user, null, 2));
      alert(t('checkConsole'));
    } catch (_err) {
      alert(t('detailOutputFailed'));
    }
  };

  return (
    <div>
      <h3>{t('leadershipTable')}</h3>
      <p>{t('csvDownloadHelp')}</p>
      <ExportUsersButton allUsers={users} filteredUsers={filteredUsers} />
      <AdminLayout.AdminTableWrap>
        <AdminLayout.AdminTable style={{ minWidth: '1440px' }}>
          <colgroup>
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '160px' }} />
          </colgroup>
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('kakaoName')}</th>
              <th>{t('department')}</th>
              <th>{t('phone')}</th>
              <th>{t('studentId')}</th>
              <th>{t('role')}</th>
              <th>{t('status')}</th>
              <th>{t('save')}</th>
              <th>{t('viewDetails')}</th>
            </tr>
            <tr>
              <td>
                <AdminLayout.AdminInput
                  value={filter.name}
                  onChange={(e) => updateFilterCriteria('name', e.target.value)}
                />
              </td>
              <td>
                <AdminLayout.AdminInput
                  value={filter.kakao_name}
                  onChange={(e) => updateFilterCriteria('kakao_name', e.target.value)}
                />
              </td>
              <td>
                <AdminLayout.AdminSelect
                  value={filter.major}
                  onChange={(e) => updateFilterCriteria('major', e.target.value)}
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
                  value={filter.phone}
                  onChange={(e) => updateFilterCriteria('phone', e.target.value)}
                />
              </td>
              <td>
                <AdminLayout.AdminInput
                  value={filter.student_id}
                  onChange={(e) => updateFilterCriteria('student_id', e.target.value)}
                />
              </td>
              <td>
                <AdminLayout.AdminSelect
                  value={filter.role}
                  onChange={(e) => updateFilterCriteria('role', e.target.value)}
                >
                  <option value="">{t('allRoles')}</option>
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.level} value={String(role.level)}>
                      {t.raw('roles')[role.level]}
                    </option>
                  ))}
                </AdminLayout.AdminSelect>
              </td>
              <td>
                <AdminLayout.AdminSelect
                  value={filter.status}
                  onChange={(e) => updateFilterCriteria('status', e.target.value)}
                >
                  <option value="">{t('allStatuses')}</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="banned">banned</option>
                </AdminLayout.AdminSelect>
              </td>
              <td colSpan={2}></td>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <AdminLayout.AdminInput
                    value={user.name}
                    onChange={(e) => updateUserField(user.id, 'name', e.target.value)}
                  />
                </td>
                <td>{user.kakao_name || '-'}</td>
                <td>
                  <AdminLayout.AdminSelect
                    value={user.major_id ?? ''}
                    onChange={(e) =>
                      updateUserField(user.id, 'major_id', Number(e.target.value))
                    }
                  >
                    <option value="">{t('selectMajor')}</option>
                    {majors.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.college} - {m.major_name}
                      </option>
                    ))}
                  </AdminLayout.AdminSelect>
                </td>
                <td>
                  <AdminLayout.AdminInput
                    value={user.phone || ''}
                    onChange={(e) => updateUserField(user.id, 'phone', e.target.value)}
                  />
                </td>
                <td>
                  <AdminLayout.AdminInput
                    value={user.student_id || ''}
                    onChange={(e) => updateUserField(user.id, 'student_id', e.target.value)}
                  />
                </td>
                <td>
                  <AdminLayout.AdminSelect
                    value={roleNumberToString(user.role)}
                    onChange={(e) => updateUserField(user.id, 'role', e.target.value)}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.level} value={role.english}>
                        {t.raw('roles')[role.level]}
                      </option>
                    ))}
                  </AdminLayout.AdminSelect>
                </td>
                <td>
                  <AdminLayout.AdminSelect
                    value={user.is_active ? 'active' : user.is_banned ? 'banned' : 'inactive'}
                    onChange={(e) => updateUserStatus(user.id, e.target.value)}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="banned">banned</option>
                  </AdminLayout.AdminSelect>
                </td>
                <td>
                  <AdminLayout.AdminButton
                    onClick={() => sendUserData(user)}
                    disabled={saving[user.id]}
                  >
                    {t('save')}
                  </AdminLayout.AdminButton>
                </td>
                <td>
                  <AdminLayout.AdminButton variant="secondary" onClick={() => showDetail(user)}>
                    {t('viewDetails')}
                  </AdminLayout.AdminButton>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminLayout.AdminTable>
      </AdminLayout.AdminTableWrap>
    </div>
  );
}
