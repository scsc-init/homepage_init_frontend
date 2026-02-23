'use client';
import { useEffect, useState } from 'react';
import ExportUsersButton from './ExportUsersButton';

export default function UserList({ users: usersDefault, majors = [] }) {
  const [users, setUsers] = useState(usersDefault ?? []);
  const [filteredUsers, setFilteredUsers] = useState(usersDefault ?? []);
  const [saving, setSaving] = useState({});
  const [filter, setFilter] = useState({
    name: '',
    phone: '',
    student_id: '',
    role: '',
    status: '',
    major: '',
  });

  const updateUserField = (userId, field, value) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, [field]: value } : u)));
    setFilteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, [field]: value } : u)),
    );
  };
  const updateUserStatus = (userId, value) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, is_active: value === 'active', is_banned: value === 'banned' }
          : u,
      ),
    );
    setFilteredUsers((prev) =>
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
    const lower = (v) => v?.toString().toLowerCase() || '';
    const matches = (u) =>
      (!newFilter.name || lower(u.name).includes(lower(newFilter.name))) &&
      (!newFilter.phone || lower(u.phone).includes(lower(newFilter.phone))) &&
      (!newFilter.student_id || lower(u.student_id).includes(lower(newFilter.student_id))) &&
      (!newFilter.role || lower(u.role).includes(lower(newFilter.role))) &&
      (!newFilter.status ||
        (u.is_active ? 'active' : u.is_banned ? 'banned' : 'inactive') === newFilter.status) &&
      (!newFilter.major || lower(u.major_id).toString() === newFilter.major);
    setFilteredUsers(users.filter(matches));
  };

  const roleNumberToString = (val) => {
    const map = {
      0: 'lowest',
      100: 'dormant',
      200: 'newcomer',
      300: 'member',
      400: 'oldboy',
      500: 'executive',
      1000: 'president',
    };
    return typeof val === 'string' ? val : (map[val] ?? 'member');
  };

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
    const res = await fetch(`/api/executive/user/${user.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.status === 204) alert(`${user.name} 저장 완료`);
    else alert(`${user.name} 저장 실패: ${res.status}`);
    setSaving((prev) => ({ ...prev, [user.id]: false }));
  };

  const manualEnroll = async (user) => {
    setSaving((prev) => ({ ...prev, [user.id]: true }));
    const res = await fetch(`/api/executive/user/standby/process/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
    });
    if (res.status === 204) alert(`${user.name} 입금 확인 완료`);
    else alert(`${user.name} 입금 확인 실패: ${res.status}`);
    setSaving((prev) => ({ ...prev, [user.id]: false }));
  };

  return (
    <div>
      <h3>유저 csv 다운로드</h3>
      <p>아래 table 첫째 줄에서 필터 적용 후 다운 받으세요.</p>
      <div className="adm-actions">
        <ExportUsersButton filteredUsers={filteredUsers} />
      </div>

      <h3>유저 편집</h3>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th className="adm-th">이름</th>
              <th className="adm-th">학과</th>
              <th className="adm-th">전화번호</th>
              <th className="adm-th">학번</th>
              <th className="adm-th">권한</th>
              <th className="adm-th">상태</th>
              <th className="adm-th">저장</th>
              <th className="adm-th">입금 확인</th>
            </tr>
            <tr>
              <td className="adm-td">
                <input
                  className="adm-input"
                  value={filter.name}
                  onChange={(e) => updateFilterCriteria('name', e.target.value)}
                />
              </td>
              <td className="adm-td">
                <select
                  className="adm-select"
                  value={filter.major}
                  onChange={(e) => updateFilterCriteria('major', e.target.value)}
                >
                  <option value="">전공 전체</option>
                  {majors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.college} - {m.major_name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="adm-td">
                <input
                  className="adm-input"
                  value={filter.phone}
                  onChange={(e) => updateFilterCriteria('phone', e.target.value)}
                />
              </td>
              <td className="adm-td">
                <input
                  className="adm-input"
                  value={filter.student_id}
                  onChange={(e) => updateFilterCriteria('student_id', e.target.value)}
                />
              </td>
              <td className="adm-td">
                <input
                  className="adm-input"
                  value={filter.role}
                  onChange={(e) => updateFilterCriteria('role', e.target.value)}
                />
              </td>
              <td className="adm-td">
                <select
                  className="adm-select"
                  value={filter.status}
                  onChange={(e) => updateFilterCriteria('status', e.target.value)}
                >
                  <option value="">상태 전체</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="banned">banned</option>
                </select>
              </td>
              <td className="adm-td"></td>
              <td className="adm-td"></td>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="adm-td">
                  <input
                    className="adm-input"
                    value={user.name}
                    onChange={(e) => updateUserField(user.id, 'name', e.target.value)}
                  />
                </td>
                <td className="adm-td">
                  <select
                    className="adm-select"
                    value={user.major_id}
                    onChange={(e) =>
                      updateUserField(user.id, 'major_id', Number(e.target.value))
                    }
                  >
                    <option value="">전공 선택</option>
                    {majors.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.college} - {m.major_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="adm-td">
                  <input
                    className="adm-input"
                    value={user.phone || ''}
                    onChange={(e) => updateUserField(user.id, 'phone', e.target.value)}
                  />
                </td>
                <td className="adm-td">
                  <input
                    className="adm-input"
                    value={user.student_id || ''}
                    onChange={(e) => updateUserField(user.id, 'student_id', e.target.value)}
                  />
                </td>
                <td className="adm-td">
                  <select
                    className="adm-select"
                    value={roleNumberToString(user.role)}
                    onChange={(e) => updateUserField(user.id, 'role', e.target.value)}
                  >
                    <option value="president">회장</option>
                    <option value="executive">운영진</option>
                    <option value="member">정회원</option>
                    <option value="oldboy">졸업생</option>
                    <option value="newcomer">준회원</option>
                    <option value="dormant">휴회원</option>
                    <option value="lowest">최저권한</option>
                  </select>
                </td>
                <td className="adm-td">
                  <select
                    className="adm-select"
                    value={user.is_active ? 'active' : user.is_banned ? 'banned' : 'inactive'}
                    onChange={(e) => updateUserStatus(user.id, e.target.value)}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="banned">banned</option>
                  </select>
                </td>
                <td className="adm-td">
                  <button
                    className="adm-button"
                    onClick={() => sendUserData(user)}
                    disabled={saving[user.id]}
                  >
                    저장
                  </button>
                </td>
                <td className="adm-td">
                  <button
                    className="adm-button outline"
                    onClick={() => manualEnroll(user)}
                    disabled={saving[user.id]}
                  >
                    입금 확인
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
