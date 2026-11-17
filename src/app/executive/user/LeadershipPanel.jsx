'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import * as AdminLayout from '@/app/executive/AdminLayout';
import { setKvClient } from '@/util/fetch/client-util';

function renderUserSummary(user, t) {
  if (!user) return <span>{t('unassigned')}</span>;
  return (
    <AdminLayout.AdminFlex style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <span>
        <strong>{user.name}</strong> ({user.email})
      </span>
      <span>{t('phoneValue', { value0: user.phone ?? '' })}</span>
      <span>{t('studentIdValue', { value0: user.student_id ?? '' })}</span>
    </AdminLayout.AdminFlex>
  );
}

export default function LeadershipPanel({ initialLeadership, candidates }) {
  const t = useTranslations('Executive');
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
      alert(t('presidentViceConflict'));
      return;
    }
    if (selectedPresidentId == '') {
      alert(t('presidentRequired'));
      return;
    }
    if (
      new Set(selectedVicePresidentIds.filter((id) => id !== '')).size !==
      selectedVicePresidentIds.filter((id) => id !== '').length
    ) {
      alert(t('vicePresidentConflict'));
      return;
    }
    setPending(true);
    try {
      const [prezRes, viceRes] = await Promise.all([
        setKvClient('main-president', presidentTrimmed),
        setKvClient('vice-president', vicePresidentTrimmed),
      ]);

      if (!prezRes.ok || !viceRes.ok) {
        const msg1 = prezRes.ok ? '' : await prezRes.text().catch(() => '');
        const msg2 = viceRes.ok ? '' : await viceRes.text().catch(() => '');
        throw new Error(
          [msg1, msg2].filter(Boolean).join(' | ') || t('leadershipUpdateFailed'),
        );
      }

      alert(t('leadershipUpdated'));
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(t('leadershipSaveFailed'));
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
                <th style={{ width: '20%' }}>{t('position')}</th>
                <th style={{ width: '40%' }}>{t('currentExecutive')}</th>
                <th style={{ width: '40%' }}>{t('selectExecutive')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('president')}</td>
                <td>{renderUserSummary(registeredPresident, t)}</td>
                <td>
                  <AdminLayout.AdminSelect
                    value={selectedPresidentId}
                    onChange={(event) => setSelectedPresidentId(event.target.value)}
                    disabled={pending}
                  >
                    <option value="">{t('unassigned')}</option>
                    {sortedCandidates.map((candidate) => (
                      <option key={candidate.id} value={String(candidate.id ?? '')}>
                        {candidate.name} ({candidate.email})
                      </option>
                    ))}
                  </AdminLayout.AdminSelect>
                  {selectedPresident && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                      {t('selectedExecutive', {
                        value0: selectedPresident.name ?? '',
                        value1: selectedPresident.email ?? '',
                      })}
                    </p>
                  )}
                </td>
              </tr>
              {selectedVicePresidentIds.map((id, idx) => (
                <tr key={`${id}-${idx}`}>
                  <td>{t('vicePresident')}</td>
                  <td>
                    {renderUserSummary(
                      idx < registeredVicePresidents.length
                        ? registeredVicePresidents[idx]
                        : null,
                      t,
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
                      <option value="">{t('unassigned')}</option>
                      {sortedCandidates.map((candidate) => (
                        <option key={candidate.id} value={String(candidate.id ?? '')}>
                          {candidate.name} ({candidate.email})
                        </option>
                      ))}
                    </AdminLayout.AdminSelect>
                    {selectedVicePresident[idx]?.name && (
                      <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        {t('selectedExecutive', {
                          value0: selectedVicePresident[idx].name ?? '',
                          value1: selectedVicePresident[idx].email ?? '',
                        })}
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
            {pending ? t('saving') : t('saveChanges')}
          </AdminLayout.AdminButton>
          <span style={{ fontSize: '0.875rem' }}>{t('unassignedHelp')}</span>
        </AdminLayout.AdminActions>
      </form>
      <AdminLayout.AdminActions>
        <AdminLayout.AdminButton
          disabled={pending}
          onClick={() => setSelectedVicePresidentIds((ids) => [...ids, ''])}
        >
          {t('addVicePresident')}
        </AdminLayout.AdminButton>
        <span style={{ fontSize: '0.875rem' }}>{t('removeVicePresidentHelp')}</span>
      </AdminLayout.AdminActions>
    </div>
  );
}
