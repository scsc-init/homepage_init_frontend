'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { useMemo, useState, useEffect } from 'react';
import * as AdminLayout from '@/app/executive/AdminLayout';
import { roleKorean } from '@/util/constants';

export function ReadUserTable({ users: usersDefault = [], majors = [] }) {
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
          lower(roleLabel(u.role)).includes(lower(filter.role))) &&
        (!filter.status || statusValue === filter.status) &&
        (!filter.major || String(u.major_id) === filter.major)
      );
    });
  }, [users, filter]);

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
      if (res.status === 204) alert(`${user.name} 입금 확인 완료`);
      else alert(`${user.name} 입금 확인 실패: ${res.status}`);
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
      <h3>Read 테이블</h3>
      <p>전화번호/학번 없이 기본 정보와 입금 여부만 확인할 수 있습니다.</p>
      <AdminLayout.AdminTableWrap>
        <AdminLayout.AdminTable>
          <thead>
            <tr>
              <th>이름</th>
              <th>카톡 이름</th>
              <th>학과</th>
              <th>권한</th>
              <th>상태</th>
              <th>입금 확인</th>
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
                  <option value="">전공 전체</option>
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
                  <option value="">상태 전체</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="banned">banned</option>
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
                  <td>{roleLabel(user.role)}</td>
                  <td>{status}</td>
                  <td>
                    <AdminLayout.AdminButton
                      variant="secondary"
                      onClick={() => manualEnroll(user)}
                      disabled={saving[user.id]}
                    >
                      입금 확인
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
