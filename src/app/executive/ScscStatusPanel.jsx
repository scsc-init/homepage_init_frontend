'use client';

import { SEMESTER_MAP } from '@/util/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STATUS_MAP = {
  surveying: '설문중',
  recruiting: '모집중',
  active: '활동중',
  inactive: '비활성',
};
const TRANSITION_MAP_REGULAR = {
  inactive: 'surveying',
  surveying: 'recruiting',
  recruiting: 'active',
  active: 'surveying',
};
const TRANSITION_MAP_SEASONAL = {
  inactive: 'surveying',
  surveying: 'recruiting',
  recruiting: 'active',
  active: 'inactive',
};
const REQUIRED_PHRASE = 'confirm change';

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
    const res = await fetch(`/api/executive/scsc/global/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: selectedStatus }),
    });
    if (res.status === 204) {
      alert('상태가 변경되었습니다.');
      setCurrentStatus(selectedStatus);
      router.refresh();
    } else {
      const error = await res.text();
      alert('업데이트 실패: ' + error);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const [nextStatus, nextSemester, nextYear] = currentStatus
    ? getNextStatus(currentStatus, semester, year)
    : [null, null, null];
  const totalRequiredPhrase = `${nextYear}-${SEMESTER_MAP[nextSemester]} ${STATUS_MAP[nextStatus]} ${REQUIRED_PHRASE}`;

  return (
    <>
      {currentStatus && modalOpen && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-card">
            <h3>상태 변경 확인</h3>
            <h4>
              {year}년 {SEMESTER_MAP[semester]}학기 → {nextYear}년 {SEMESTER_MAP[nextSemester]}
              학기
            </h4>
            <h4>
              {STATUS_MAP[currentStatus]} → {STATUS_MAP[nextStatus]}
            </h4>
            <p>다음 문구를 입력해야 변경됩니다:</p>
            <pre className="adm-pre" style={{ userSelect: 'none' }}>
              {totalRequiredPhrase}
            </pre>
            <input
              className="adm-input"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="확인 문구 입력"
            />
            <div className="adm-flex" style={{ justifyContent: 'flex-end' }}>
              <button className="adm-button outline" onClick={() => setModalOpen(false)}>
                취소
              </button>
              <button
                className="adm-button"
                onClick={handleConfirmSave}
                disabled={confirmationText !== totalRequiredPhrase || saving}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="adm-section">
        <h2>SCSC 전체 상태 관리</h2>
        {!currentStatus ? (
          <div>상태를 불러오지 못했습니다.</div>
        ) : (
          <div>
            <div>
              {year}년 {SEMESTER_MAP[semester]}학기 → {nextYear}년 {SEMESTER_MAP[nextSemester]}
              학기
            </div>
            <div className="adm-flex" style={{ flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 700 }}>
                {STATUS_MAP[currentStatus] || currentStatus}
              </div>
              <span style={{ fontSize: '1.2rem' }}>→</span>
              <button
                key={nextStatus}
                className="adm-button outline"
                onClick={() => saveToModal(nextStatus)}
                disabled={saving}
              >
                {STATUS_MAP[nextStatus] || nextStatus}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
