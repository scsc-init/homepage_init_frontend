'use client';

import { useEffect, useState } from 'react';
import { SEMESTER_MAP } from '@/util/constants';

export default function EnrollmentPolicyPanel({ scscGlobalStatus }) {
  const { year, semester } = scscGlobalStatus;

  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead>
          <tr>
            <th className="adm-th" style={{ width: '6em' }}>
              등록 시점
            </th>
            <th className="adm-th" style={{ width: '10em' }}>
              등록 부여할 학기 수
            </th>
            <th className="adm-th">설명</th>
            <th className="adm-th" style={{ width: '5em' }}>
              저장
            </th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3].map((v) => {
            const [y, s] = getNextSemester(year, semester, v);
            return <TREnrollment year={y} semester={s} key={`${y}-${s}`} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

function TREnrollment({ year, semester }) {
  const kvKey = `grant_semester_count_${semester}`;
  const [isFetching, setIsFetching] = useState(false);
  const [grantCount, setGrantCount] = useState(0);
  useEffect(() => {
    const getGrantCount = async () => {
      const res = await fetch(`/api/kv/${kvKey}`);
      if (!res.ok) return;
      const grant = Number((await res.json()).value);
      if (!Number.isInteger(grant)) return;
      setGrantCount(grant);
    };
    getGrantCount();
  }, []);

  const sendData = async () => {
    if (isFetching) return;
    if (grantCount < 1) {
      alert('값을 1 미만으로 설정할 수 없습니다.');
      return;
    }
    if (!Number.isInteger(grantCount)) {
      alert('값을 정수로 설정하십시오.');
      return;
    }
    setIsFetching(true);
    try {
      const res = await fetch(`/api/kv/${kvKey}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: grantCount.toString() }),
      });
      if (res.ok) {
        alert('저장에 성공했습니다.');
      } else if (res.status === 401 || res.status === 403) {
        alert('편집 권한이 없습니다.');
        router.refresh();
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (e) {
      alert('저장 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setIsFetching(false);
    }
  };

  let grantSemesters = [];
  let i;
  for (i = 0; i < grantCount; i++) {
    const [y, s] = getNextSemester(year, semester, i);
    grantSemesters.push(`${y}-${SEMESTER_MAP[s]}학기`);
  }

  return (
    <tr>
      <td className="adm-td">{SEMESTER_MAP[semester]}학기</td>
      <td className="adm-td">
        <input
          type="number"
          className="adm-input"
          value={grantCount}
          onChange={(e) => setGrantCount(Number(e.target.value))}
        />
      </td>
      <td className="adm-td">
        {grantCount >= 1
          ? `${year}-${SEMESTER_MAP[semester]}학기에 등록 시 ${grantSemesters.join(', ')}에 등록 처리됩니다.`
          : '값을 1 이상으로 설정하십시오.'}
      </td>
      <td>
        <button className="adm-button" onClick={sendData} disabled={isFetching}>
          저장
        </button>
      </td>
    </tr>
  );
}

function getNextSemester(year, semester, nextCount) {
  return [year + ((semester + nextCount - 1) >> 2), ((semester + nextCount - 1) % 4) + 1];
}
