'use client';
import React, { useState } from 'react';


export default function SigMembersPanel({ sigs: sigsDefault, users: usersDefault }) {
  const [sigs, setSigs] = useState(sigsDefault ?? []);
  const [filteredSigs, setFilteredSigs] = useState([]);
  const [selectedSig, setSelectedSig] = useState(null);
  const [sigFilter, setSigFilter] = useState({
    title: '',
  });
  const [users, setUsers] = useState(usersDefault ?? []);
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
      (newFilter.title && lower(sig.title).includes(lower(newFilter.title)));
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
    const res = await fetch(`/api/executive/sig/${selectedSig.id}/member/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: u.id
      }),
    });
    if (res.status === 204) {setMembers((prev) => ([ ...prev, {'user_id': u.id, 'user': {'id':u.id, 'email': u.email, 'name': u.name}} ])); alert('저장 완료');}
    else alert('저장 실패: ' + res.status);
    setUserLoading((prev) => ({ ...prev, [u.id]: false }));
  };

  const handleDeleteMember = async (m) => {
    setMemberLoading((prev) => ({ ...prev, [m.user_id]: true }));
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/executive/sig/${selectedSig.id}/member/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: m.user_id,
      }),
    });
    if (res.status === 204) {setMembers((prev) => prev.filter((m) => m.user_id !== id)); alert('저장 완료');}
    else alert('삭제 실패: ' + res.status);
    setMemberLoading((prev) => ({ ...prev, [m.user_id]: false }));
  };

  return (
    <div className="adm-table-wrap">
      <h3>SIG 이름으로 검색: </h3>
      <input
        className="adm-input"
        value={sigFilter.title}
        onChange={(e) => updateSigFilterCriteria('title', e.target.value)}
      />
      <table className="adm-table">
        <tbody>
          {filteredSigs.map((sig) => (
            <tr key={sig.id}>
              <td className="adm-td">{sig.id}</td>
              <td className="adm-td">{sig.title}</td>
              <td className="adm-td">{sig.status}</td>
              <td className="adm-td">{sig.year}</td>
              <td className="adm-td">{sig.semester}</td>
              <td className="adm-td">
                <select
                  className="adm-select"
                  value={sig.members}
                >
                  {sig.members.map((m) => (
                    <option key={m.user_id}>{m.user.name}</option>
                  ))}
                </select>
              </td>
              <td className="adm-td">
                <button
                  className="adm-button"
                  onClick={() => {setSelectedSig(sig); setMembers(sig.members); setFilteredMembers(sig.members);}}
                >
                  선택
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedSig && (
        <div>
          <h4>SIG 구성원 추가</h4>
          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-th">이름</th>
                <th className="adm-th">이메일</th>
                <th className="adm-th">작업</th>
              </tr>
              <tr>
                <td className="adm-td">
                  <input
                    className="adm-input"
                    value={userFilter.name}
                    onChange={(e) => updateUserFilterCriteria('name', e.target.value)}
                  />
                </td>
                <td className="adm-td">
                  <input
                    className="adm-input"
                    value={userFilter.email}
                    onChange={(e) => updateUserFilterCriteria('email', e.target.value)}
                  />
                </td>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td className="adm-td">{u.name}</td>
                  <td className="adm-td">{u.email}</td>
                  <td className="adm-td">
                    <button
                      className="adm-button"
                      onClick={() => handleAddMember(u)}
                    >
                      추가
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>SIG 구성원 삭제</h4>
          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-th">이름</th>
                <th className="adm-th">이메일</th>
                <th className="adm-th">작업</th>
              </tr>
              <tr>
                <td className="adm-td">
                  <input
                    className="adm-input"
                    value={memberFilter.name}
                    onChange={(e) => updateMemberFilterCriteria('name', e.target.value)}
                  />
                </td>
                <td className="adm-td">
                  <input
                    className="adm-input"
                    value={memberFilter.email}
                    onChange={(e) => updateMemberFilterCriteria('email', e.target.value)}
                  />
                </td>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.user_id}>
                  <td className="adm-td">{m.user.name}</td>
                  <td className="adm-td">{m.user.email}</td>
                  <td className="adm-td">
                    <button
                      className="adm-button"
                      onClick={() => handleDeleteMember(m)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
