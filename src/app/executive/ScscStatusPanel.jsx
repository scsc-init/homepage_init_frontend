'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as AdminLayout from '@/app/executive/AdminLayout';

const TRANSITION_MAP_REGULAR = {
  recruiting: 'active',
  active: 'recruiting',
};
const TRANSITION_MAP_SEASONAL = {
  recruiting: 'active',
  active: 'recruiting',
};

const getNextStatus = (currentStatus, currentSemester, currentYear) => {
  return [
    currentSemester % 2 === 1
      ? TRANSITION_MAP_REGULAR[currentStatus]
      : TRANSITION_MAP_SEASONAL[currentStatus],
    currentStatus === 'active' ? (currentSemester % 4) + 1 : currentSemester,
    currentSemester === 4 && currentStatus === 'active' ? currentYear + 1 : currentYear,
  ];
};

export default function ScscStatusPanel({ scscGlobalStatus, semester, year }) {
  const t = useTranslations('Executive');
  const statusLabels = t.raw('statuses');
  const semesterLabels = t.raw('semesters');
  const [currentStatus, setCurrentStatus] = useState(scscGlobalStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');

  const saveToModal = (status) => {
    setSelectedStatus(status);
    setConfirmationText('');
    setModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    const res = await fetchBackendClient(`/api/executive/scsc/global/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: selectedStatus }),
    });
    if (res.status === 204) {
      alert(t('statusChanged'));
      setCurrentStatus(selectedStatus);
      router.refresh();
    } else {
      const error = await res.text();
      alert(t('updateFailedPrefix') + error);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const [nextStatus, nextSemester, nextYear] = currentStatus
    ? getNextStatus(currentStatus, semester, year)
    : [null, null, null];
  const totalRequiredPhrase = t('statusConfirmation', {
    value0: String(nextYear),
    value1: String(semesterLabels[nextSemester]),
    value2: String(statusLabels[nextStatus]),
  });

  return (
    <>
      {currentStatus && modalOpen && (
        <AdminLayout.AdminModalOverlay>
          <AdminLayout.AdminModalCard>
            <h3>{t('confirmStatusChange')}</h3>
            <h4>
              {t('semesterTransition', {
                value0: year ?? '',
                value1: semesterLabels[semester] ?? '',
                value2: nextYear ?? '',
                value3: semesterLabels[nextSemester] ?? '',
              })}
            </h4>
            <h4>
              {statusLabels[currentStatus]} → {statusLabels[nextStatus]}
            </h4>
            <p>{t('confirmationInstructions')}</p>
            <AdminLayout.AdminPre style={{ userSelect: 'none' }}>
              {totalRequiredPhrase}
            </AdminLayout.AdminPre>
            <AdminLayout.AdminInput
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={t('confirmationPlaceholder')}
            />
            <AdminLayout.AdminFlex style={{ justifyContent: 'flex-end' }}>
              <AdminLayout.AdminButton variant="secondary" onClick={() => setModalOpen(false)}>
                {t('cancel')}
              </AdminLayout.AdminButton>
              <AdminLayout.AdminButton
                onClick={handleConfirmSave}
                disabled={confirmationText !== totalRequiredPhrase || saving}
              >
                {t('confirm')}
              </AdminLayout.AdminButton>
            </AdminLayout.AdminFlex>
          </AdminLayout.AdminModalCard>
        </AdminLayout.AdminModalOverlay>
      )}

      <AdminLayout.AdminSection>
        <h3>{t('globalStatus')}</h3>
        {!currentStatus ? (
          <div>{t('statusLoadFailed')}</div>
        ) : (
          <div>
            <div>
              {t('semesterTransition', {
                value0: year ?? '',
                value1: semesterLabels[semester] ?? '',
                value2: nextYear ?? '',
                value3: semesterLabels[nextSemester] ?? '',
              })}
            </div>
            <AdminLayout.AdminFlex style={{ flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 700 }}>
                {statusLabels[currentStatus] || currentStatus}
              </div>
              <span style={{ fontSize: '1.2rem' }}>→</span>
              <AdminLayout.AdminButton
                key={nextStatus}
                variant="secondary"
                onClick={() => saveToModal(nextStatus)}
                disabled={saving}
              >
                {statusLabels[nextStatus] || nextStatus}
              </AdminLayout.AdminButton>
            </AdminLayout.AdminFlex>
          </div>
        )}
      </AdminLayout.AdminSection>
    </>
  );
}
