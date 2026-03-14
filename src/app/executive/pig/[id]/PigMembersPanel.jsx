'use client';

import { useState } from 'react';
import styles from '../../igpage.module.css';

function PigMemberAdd({
  userFilter,
  filteredUsers,
  updateUserFilterCriteria,
  handleAddMember,
  userLoading,
}) {
  return (
    <div>
      <h4>PIG 구성원 추가</h4>
      <table className={styles['adm-table']}>
        <thead>
          <tr>
            <th className={styles['adm-th']}>이름</th>
            <th className={styles['adm-th']}>이메일</th>
            <th className={styles['adm-th']}>작업</th>
          </tr>
          <tr>
            <td className={styles['adm-td']}>
              <input
                className={styles['adm-input']}
                value={userFilter.name}
                onChange={(e) => updateUserFilterCriteria('name', e.target.value)}
              />
            </td>
            <td className={styles['adm-td']}>
              <input
                className={styles['adm-input']}
                value={userFilter.email}
                onChange={(e) => updateUserFilterCriteria('email', e.target.value)}
              />
            </td>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td className={styles['adm-td']}>{u.name}</td>
              <td className={styles['adm-td']}>{u.email}</td>
              <td className={styles['adm-td']}>
                <button
                  className={styles['adm-button']}
                  onClick={() => handleAddMember(u)}
                  disabled={userLoading[u.id]}
                >
                  추가
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PigMemberDelete({
  memberFilter,
  filteredMembers,
  updateMemberFilterCriteria,
  handleDeleteMember,
  memberLoading,
}) {
  return (
    <div>
      <h4>PIG 구성원 삭제</h4>
      <table className={styles['adm-table']}>
        <thead>
          <tr>
            <th className={styles['adm-th']}>이름</th>
            <th className={styles['adm-th']}>이메일</th>
            <th className={styles['adm-th']}>작업</th>
          </tr>
          <tr>
            <td className={styles['adm-td']}>
              <input
                className={styles['adm-input']}
                value={memberFilter.name}
                onChange={(e) => updateMemberFilterCriteria('name', e.target.value)}
              />
            </td>
            <td className={styles['adm-td']}>
              <input
                className={styles['adm-input']}
                value={memberFilter.email}
                onChange={(e) => updateMemberFilterCriteria('email', e.target.value)}
              />
            </td>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((m) => (
            <tr key={m.user_id}>
              <td className={styles['adm-td']}>{m.user.name}</td>
              <td className={styles['adm-td']}>{m.user.email}</td>
              <td className={styles['adm-td']}>
                <button
                  className={styles['adm-button']}
                  onClick={() => handleDeleteMember(m)}
                  disabled={memberLoading[m.user_id]}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PigMembersPanel({ pig, users }) {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userFilter, setUserFilter] = useState({
    name: '',
    email: '',
  });
  const [userLoading, setUserLoading] = useState({});
  const [members, setMembers] = useState(pig?.members ?? []);
  const [filteredMembers, setFilteredMembers] = useState(pig?.members ?? []);
  const [memberFilter, setMemberFilter] = useState({
    name: '',
    email: '',
  });
  const [memberLoading, setMemberLoading] = useState({});

  const updateUserFilterCriteria = (field, value) => {
    const newFilter = { ...userFilter, [field]: value };
    setUserFilter(newFilter);
    const lower = (v) => v?.toString().toLowerCase() || '';
    const matches = (u) =>
      (newFilter.name || newFilter.email) &&
      (!newFilter.name || lower(u.name).includes(lower(newFilter.name))) &&
      (!newFilter.email || lower(u.email).includes(lower(newFilter.email)));
    setFilteredUsers(users.filter(matches));
  };

  const updateMemberFilterCriteria = (field, value) => {
    const newFilter = { ...memberFilter, [field]: value };
    setMemberFilter(newFilter);
    const lower = (v) => v?.toString().toLowerCase() || '';
    const matches = (m) =>
      (!newFilter.name || lower(m.user.name).includes(lower(newFilter.name))) &&
      (!newFilter.email || lower(m.user.email).includes(lower(newFilter.email)));
    setFilteredMembers(members.filter(matches));
  };

  const handleAddMember = async (u) => {
    setUserLoading((prev) => ({ ...prev, [u.id]: true }));
    try {
      const res = await fetch(`/api/executive/pig/${pig.id}/member/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: u.id,
        }),
      });
      if (res.status === 204) {
        const newMember = { user_id: u.id, user: { id: u.id, email: u.email, name: u.name } };
        setMembers((prev) => [...prev, newMember]);
        const lower = (v) => v?.toString().toLowerCase() || '';
        const matches = (m) =>
          (!memberFilter.name || lower(m.user.name).includes(lower(memberFilter.name))) &&
          (!memberFilter.email || lower(m.user.email).includes(lower(memberFilter.email)));
        setFilteredMembers((prev) => [...prev, newMember].filter(matches));
        alert('저장 완료');
      } else {
        alert('저장 실패: ' + res.status);
      }
    } catch (error) {
      console.error('Add member failed:', error);
      alert('저장 실패: 네트워크 오류');
    } finally {
      setUserLoading((prev) => ({ ...prev, [u.id]: false }));
    }
  };

  const handleDeleteMember = async (member) => {
    setMemberLoading((prev) => ({ ...prev, [member.user_id]: true }));
    try {
      const res = await fetch(`/api/executive/pig/${pig.id}/member/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: member.user_id,
        }),
      });
      if (res.status === 204) {
        setMembers((prev) => prev.filter((m) => member.user_id !== m.user_id));
        setFilteredMembers((prev) => prev.filter((m) => member.user_id !== m.user_id));
        alert('삭제 완료');
      } else {
        const error = await res.json().catch(() => ({ message: 'Unknown error' }));
        alert(`삭제 실패: ${error.message || res.status}`);
      }
    } catch (error) {
      console.error('Delete member failed:', error);
      alert('삭제 실패: 네트워크 오류');
    } finally {
      setMemberLoading((prev) => ({ ...prev, [member.user_id]: false }));
    }
  };

  return (
    <div>
      <div className={styles['adm-table']}>
        {pig && (
          <div>
            <hr></hr>
            <h3>{pig.title}</h3>
            <PigMemberAdd
              userFilter={userFilter}
              filteredUsers={filteredUsers}
              updateUserFilterCriteria={updateUserFilterCriteria}
              handleAddMember={handleAddMember}
              userLoading={userLoading}
            />
            <PigMemberDelete
              memberFilter={memberFilter}
              filteredMembers={filteredMembers}
              updateMemberFilterCriteria={updateMemberFilterCriteria}
              handleDeleteMember={handleDeleteMember}
              memberLoading={memberLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
