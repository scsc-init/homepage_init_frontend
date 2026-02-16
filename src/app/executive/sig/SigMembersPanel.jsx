'use client';

import { useState } from 'react';
import styles from '../igpage.module.css';

function SigSelect({
  sigFilter,
  filteredSigs,
  updateSigFilterCriteria,
  setSelectedSig,
  setMembers,
  setFilteredMembers,
}) {
  return (
    <div className={styles['adm-table-wrap']}>
      <div>
        <h3>SIG 이름으로 검색: </h3>
        <input
          className={styles['adm-input']}
          value={sigFilter.title}
          onChange={(e) => updateSigFilterCriteria('title', e.target.value)}
        />
      </div>
      <table className={styles['adm-table']}>
        <thead>
          <tr>
            <th className={styles['adm-th']}>ID</th>
            <th className={styles['adm-th']}>이름</th>
            <th className={styles['adm-th']}>상태</th>
            <th className={styles['adm-th']}>연도</th>
            <th className={styles['adm-th']}>학기</th>
            <th className={styles['adm-th']}>최초생성 연도</th>
            <th className={styles['adm-th']}>최초생성 학기</th>
            <th className={styles['adm-th']}>구성원</th>
            <th className={styles['adm-th']}>작업</th>
          </tr>
        </thead>
        <tbody>
          {filteredSigs.map((sig) => (
            <tr key={sig.id}>
              <td className={styles['adm-td']}>{sig.id}</td>
              <td className={styles['adm-td']}>{sig.title}</td>
              <td className={styles['adm-td']}>{sig.status}</td>
              <td className={styles['adm-td']}>{sig.year}</td>
              <td className={styles['adm-td']}>{sig.semester}</td>
              <td className={styles['adm-td']}>{sig.created_year ?? ''}</td>
              <td className={styles['adm-td']}>{sig.created_semester ?? ''}</td>
              <td className={styles['adm-td']}>
                <select className={styles['adm-select']} value={''}>
                  {sig.members.map((m) => (
                    <option key={m.user_id}>{m.user.name}</option>
                  ))}
                </select>
              </td>
              <td className={styles['adm-td']}>
                <button
                  className={styles['adm-button']}
                  onClick={() => {
                    setSelectedSig(sig);
                    setMembers(sig.members);
                    setFilteredMembers(sig.members);
                  }}
                >
                  선택
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SigMemberAdd({
  userFilter,
  filteredUsers,
  updateUserFilterCriteria,
  handleAddMember,
  userLoading,
}) {
  return (
    <div>
      <h4>SIG 구성원 추가</h4>
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

function SigMemberDelete({
  memberFilter,
  filteredMembers,
  updateMemberFilterCriteria,
  handleDeleteMember,
  memberLoading,
}) {
  return (
    <div>
      <h4>SIG 구성원 삭제</h4>
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

export default function SigMembersPanel({ sigs, users }) {
  const [filteredSigs, setFilteredSigs] = useState([]);
  const [selectedSig, setSelectedSig] = useState(null);
  const [sigFilter, setSigFilter] = useState({
    title: '',
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userFilter, setUserFilter] = useState({
    name: '',
    email: '',
  });
  const [userLoading, setUserLoading] = useState({});
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [memberFilter, setMemberFilter] = useState({
    name: '',
    email: '',
  });
  const [memberLoading, setMemberLoading] = useState({});

  const updateSigFilterCriteria = (field, value) => {
    const newFilter = { ...sigFilter, [field]: value };
    setSigFilter(newFilter);
    const lower = (v) => v?.toString().toLowerCase() || '';
    const matches = (sig) =>
      newFilter.title && lower(sig.title).includes(lower(newFilter.title));
    setFilteredSigs(sigs.filter(matches));
  };

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
      const res = await fetch(`/api/executive/sig/${selectedSig.id}/member/join`, {
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
      const res = await fetch(`/api/executive/sig/${selectedSig.id}/member/leave`, {
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
      <SigSelect
        sigFilter={sigFilter}
        filteredSigs={filteredSigs}
        updateSigFilterCriteria={updateSigFilterCriteria}
        setSelectedSig={setSelectedSig}
        setMembers={setMembers}
        setFilteredMembers={setFilteredMembers}
      />
      <div className={styles['adm-table-wrap']}>
        {selectedSig && (
          <div>
            <hr></hr>
            <h3>{selectedSig.title}</h3>
            {selectedSig.created_year != null && selectedSig.created_semester != null ? (
              <p>
                최초 생성: {selectedSig.created_year}학년도 {selectedSig.created_semester}학기
              </p>
            ) : null}
            <SigMemberAdd
              userFilter={userFilter}
              filteredUsers={filteredUsers}
              updateUserFilterCriteria={updateUserFilterCriteria}
              handleAddMember={handleAddMember}
              userLoading={userLoading}
            />
            <SigMemberDelete
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
