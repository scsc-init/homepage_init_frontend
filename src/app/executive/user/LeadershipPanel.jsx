'use client';

import { useCallback, useMemo, useState } from 'react';
import * as AdminLayout from '@/components/AdminLayout';

function sanitizeId(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' && value.trim()) return value.trim();
  return '';
}

export async function reqLeadership(body) {
  const presidentId = sanitizeId(body?.president_id);
  const vicePresidentId = sanitizeId(body?.vice_president_id);
  const vicePresidentIds = vicePresidentId
    .split(';')
    .map((id) => sanitizeId(id))
    .filter((id) => id !== '');
  if (presidentId === '') {
    return { detail: '회장 직책은 반드시 지정해야 합니다.', status: -1 };
  }

  if (new Set(vicePresidentIds).size !== vicePresidentIds.length) {
    return { detail: '부회장끼리는 서로 다른 인물이어야 합니다.', status: -1 };
  }

  if (vicePresidentIds.includes(presidentId)) {
    return { detail: '회장과 부회장은 서로 다른 인물이어야 합니다.', status: -1 };
  }
  try {
    const [prezUpdate, viceUpdate] = await Promise.all([
      fetchBackendClient('/api/kv/main-president/update', {
        method: 'POST',
        body: { value: presidentId },
      }),
      fetchBackendClient('/api/kv/vice-president/update', {
        method: 'POST',
        body: { value: vicePresidentId },
      }),
    ]);

    if (!prezUpdate.ok || !viceUpdate.ok) {
      const msg1 = prezUpdate.ok ? '' : await prezUpdate.text().catch(() => '');
      const msg2 = viceUpdate.ok ? '' : await viceUpdate.text().catch(() => '');
      const text =
        [msg1, msg2].filter(Boolean).join(' | ') || 'Failed to update leadership entries';
      return {
        text,
        status: -1,
      };
    }

    return {
      president_id: presidentId || null,
      vice_president_id: vicePresidentId || null,
      status: 1,
    };
  } catch (err) {
    const detail =
      err instanceof Error && err.message
        ? `Upstream update failed: ${err.message}`
        : 'Upstream update failed';
    return { detail, status: -1 };
  }
}

function renderUserSummary(user) {
  if (!user) return <span>미지정</span>;
  return (
    <AdminLayout.AdminFlex style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <span>
        <strong>{user.name}</strong> ({user.email})
      </span>
      <span>전화번호: {user.phone}</span>
      <span>학번: {user.student_id}</span>
    </AdminLayout.AdminFlex>
  );
}

export default function LeadershipPanel({ initialLeadership, candidates }) {
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
    if (selectedPresidentId == '') {
      alert('회장 직책은 반드시 지정해야 합니다.');
      return;
    }
    if (
      new Set(selectedVicePresidentIds.filter((id) => id !== '')).size !==
      selectedVicePresidentIds.filter((id) => id !== '').length
    ) {
      alert('부회장끼리는 서로 다른 인물이어야 합니다.');
      return;
    }
    setPending(true);
    try {
      const res = await reqLeadership({
        president_id: presidentTrimmed || null,
        vice_president_id: vicePresidentTrimmed || null,
      });

      if (res.status === -1) {
        const msg = await res.text();
        throw new Error(msg);
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
        <AdminLayout.AdminTableWrap>
          <AdminLayout.AdminTable>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>직책</th>
                <th style={{ width: '40%' }}>현재 등록된 임원</th>
                <th style={{ width: '40%' }}>변경할 임원 선택</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>회장</td>
                <td>{renderUserSummary(registeredPresident)}</td>
                <td>
                  <AdminLayout.AdminSelect
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
                  </AdminLayout.AdminSelect>
                  {selectedPresident && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                      선택됨: {selectedPresident.name} / {selectedPresident.email}
                    </p>
                  )}
                </td>
              </tr>
              {selectedVicePresidentIds.map((id, idx) => (
                <tr key={`${id}-${idx}`}>
                  <td>부회장</td>
                  <td>
                    {renderUserSummary(
                      idx < registeredVicePresidents.length
                        ? registeredVicePresidents[idx]
                        : null,
                    )}
                  </td>
                  <td>
                    <AdminLayout.AdminSelect
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
                    </AdminLayout.AdminSelect>
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
          </AdminLayout.AdminTable>
        </AdminLayout.AdminTableWrap>
        <AdminLayout.AdminActions>
          <AdminLayout.AdminButton type="submit" disabled={pending}>
            {pending ? '저장 중...' : '변경사항 저장'}
          </AdminLayout.AdminButton>
          <span style={{ fontSize: '0.875rem' }}>
            선택하지 않으면 해당 직책은 미지정 상태로 저장됩니다.
          </span>
        </AdminLayout.AdminActions>
      </form>
      <AdminLayout.AdminActions>
        <AdminLayout.AdminButton
          disabled={pending}
          onClick={() => setSelectedVicePresidentIds((ids) => [...ids, ''])}
        >
          부회장 추가
        </AdminLayout.AdminButton>
        <span style={{ fontSize: '0.875rem' }}>미지정으로 설정하면 삭제됩니다.</span>
      </AdminLayout.AdminActions>
    </div>
  );
}
