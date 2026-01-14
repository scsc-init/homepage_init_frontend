'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const [selectedPresidentId, setSelectedPresidentId] = useState(
    initialLeadership?.presidentId ?? '',
  );
  const [selectedVicePresidentIds, setSelectedVicePresidentIds] = useState(
    initialLeadership?.vicePresidentIds ?? [],
  );
  const [pending, setPending] = useState(false);

  const sortedCandidates = useMemo(() => {
    if (!Array.isArray(candidates)) return [];
    return [...candidates].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [candidates]);

  const findCandidate = useCallback(
    (id) => {
      const target = String(id ?? '').trim();
      if (!target) return null;
      return (
        sortedCandidates.find((candidate) => String(candidate?.id ?? '').trim() === target) ??
        null
      );
    },
    [sortedCandidates],
  );

  const registeredPresident = useMemo(
    () => findCandidate(initialLeadership?.presidentId ?? ''),
    [findCandidate, initialLeadership?.presidentId],
  );
  const registeredVicePresidents = useMemo(
    () => (initialLeadership?.vicePresidentIds ?? []).map(findCandidate),
    [findCandidate, initialLeadership?.vicePresidentIds],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const presidentTrimmed = String(selectedPresidentId || '').trim();
    const vicePresidentTrimmed = selectedVicePresidentIds.filter((id) => id != '').join(';');
    if (
      presidentTrimmed &&
      selectedVicePresidentIds &&
      selectedVicePresidentIds.includes(presidentTrimmed)
    ) {
      alert('회장과 부회장은 서로 다른 인물이어야 합니다.');
      return;
    }
    setPending(true);
    try {
      const res = await fetch('/api/executive/leadership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          president_id: presidentTrimmed || null,
          vice_president_id: vicePresidentTrimmed || null,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
      }

      alert('임원진 정보가 갱신되었습니다.');
      window.location.reload();
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
    () => selectedVicePresidentIds.map(findCandidate),
    [findCandidate, selectedVicePresidentIds],
  );

  return (
    <div>
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
                      <option key={candidate.id} value={String(candidate.id ?? '')}>
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
              {selectedVicePresidentIds.map((id, idx) => (
                <tr key={`${id}-${idx}`}>
                  <td className="adm-td">부회장</td>
                  <td className="adm-td">
                    {renderUserSummary(
                      idx < registeredVicePresidents.length
                        ? registeredVicePresidents[idx]
                        : null,
                    )}
                  </td>
                  <td className="adm-td">
                    <select
                      className="adm-select"
                      value={id}
                      onChange={(event) => {
                        const copy = [...selectedVicePresidentIds];
                        copy[idx] = event.target.value;
                        setSelectedVicePresidentIds(copy);
                      }}
                      disabled={pending}
                    >
                      <option value="">미지정</option>
                      {sortedCandidates.map((candidate) => (
                        <option key={candidate.id} value={String(candidate.id ?? '')}>
                          {candidate.name} ({candidate.email})
                        </option>
                      ))}
                    </select>
                    {selectedVicePresident[idx]?.name && (
                      <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        선택됨: {selectedVicePresident[idx].name} /{' '}
                        {selectedVicePresident[idx].email}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
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
      <div className="adm-actions">
        <button
          className="adm-button"
          disabled={pending}
          onClick={() => setSelectedVicePresidentIds((ids) => [...ids, ''])}
        >
          부회장 추가
        </button>
        <span style={{ fontSize: '0.875rem' }}>미지정으로 설정하면 삭제됩니다.</span>
      </div>
    </div>
  );
}
