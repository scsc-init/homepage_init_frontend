'use client';

import { useCallback, useMemo, useState } from 'react';

function renderUserSummary(user) {
  if (!user) return <span>미지정</span>;
  return (
    <div className="adm-flex" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <span>
        <strong>{user.name}</strong> ({user.email})
      </span>
      <span>전화번호: {user.phone}</span>
      <span>학번: {user.student_id}</span>
    </div>
  );
}

export default function LeadershipPanel({ initialLeadership, candidates }) {
  const [storedIds, setStoredIds] = useState({
    presidentId: initialLeadership?.presidentId ?? '',
    vicePresidentId: initialLeadership?.vicePresidentId ?? '',
  });
  const [selectedPresidentId, setSelectedPresidentId] = useState(
    initialLeadership?.presidentId ?? '',
  );
  const [selectedVicePresidentId, setSelectedVicePresidentId] = useState(
    initialLeadership?.vicePresidentId ?? '',
  );
  const [pending, setPending] = useState(false);

  const sortedCandidates = useMemo(() => {
    if (!Array.isArray(candidates)) return [];
    return [...candidates].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [candidates]);

  const findCandidate = useCallback(
    (id) => sortedCandidates.find((candidate) => candidate.id === id) ?? null,
    [sortedCandidates],
  );

  const registeredPresident = useMemo(
    () => findCandidate(storedIds.presidentId),
    [findCandidate, storedIds.presidentId],
  );
  const registeredVicePresident = useMemo(
    () => findCandidate(storedIds.vicePresidentId),
    [findCandidate, storedIds.vicePresidentId],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    try {
      const res = await fetch('/api/executive/leadership/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          president_id: selectedPresidentId || null,
          vice_president_id: selectedVicePresidentId || null,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
      }

      const updated = await res.json();
      const newPresidentId = updated?.president_id || '';
      const newVicePresidentId = updated?.vice_president_id || '';
      setStoredIds({
        presidentId: typeof newPresidentId === 'string' ? newPresidentId : '',
        vicePresidentId: typeof newVicePresidentId === 'string' ? newVicePresidentId : '',
      });
      setSelectedPresidentId(typeof newPresidentId === 'string' ? newPresidentId : '');
      setSelectedVicePresidentId(
        typeof newVicePresidentId === 'string' ? newVicePresidentId : '',
      );
      alert('임원진 정보가 갱신되었습니다.');
    } catch (error) {
      console.error(error);
      alert('임원진 정보를 저장하지 못했습니다.');
    } finally {
      setPending(false);
    }
  };

  const selectedPresident = useMemo(
    () => findCandidate(selectedPresidentId),
    [findCandidate, selectedPresidentId],
  );
  const selectedVicePresident = useMemo(
    () => findCandidate(selectedVicePresidentId),
    [findCandidate, selectedVicePresidentId],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th className="adm-th" style={{ width: '20%' }}>
                직책
              </th>
              <th className="adm-th" style={{ width: '40%' }}>
                현재 등록된 임원
              </th>
              <th className="adm-th" style={{ width: '40%' }}>
                변경할 임원 선택
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="adm-td">회장</td>
              <td className="adm-td">{renderUserSummary(registeredPresident)}</td>
              <td className="adm-td">
                <select
                  className="adm-select"
                  value={selectedPresidentId}
                  onChange={(event) => setSelectedPresidentId(event.target.value)}
                  disabled={pending}
                >
                  <option value="">미지정</option>
                  {sortedCandidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name} ({candidate.email})
                    </option>
                  ))}
                </select>
                {selectedPresident && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    선택됨: {selectedPresident.name} / {selectedPresident.email}
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td className="adm-td">부회장</td>
              <td className="adm-td">{renderUserSummary(registeredVicePresident)}</td>
              <td className="adm-td">
                <select
                  className="adm-select"
                  value={selectedVicePresidentId}
                  onChange={(event) => setSelectedVicePresidentId(event.target.value)}
                  disabled={pending}
                >
                  <option value="">미지정</option>
                  {sortedCandidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name} ({candidate.email})
                    </option>
                  ))}
                </select>
                {selectedVicePresident && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    선택됨: {selectedVicePresident.name} / {selectedVicePresident.email}
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="adm-actions">
        <button className="adm-button" type="submit" disabled={pending}>
          {pending ? '저장 중...' : '변경사항 저장'}
        </button>
        <span style={{ fontSize: '0.875rem' }}>
          선택하지 않으면 해당 직책은 미지정 상태로 저장됩니다.
        </span>
      </div>
    </form>
  );
}
