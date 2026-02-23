'use client';

import { useEffect, useMemo, useState } from 'react';
import { SEMESTER_MAP } from '@/util/constants';

const ENROLLMENT_POLICY_KV_KEY = `enrollment_grant_until`;
export default function EnrollmentPolicyPanel({ scscGlobalStatus }) {
  const [isFetching, setIsFetching] = useState(true);
  const [year, setYear] = useState();
  const [semester, setSemester] = useState();
  useEffect(() => {
    const getGrantPolicy = async () => {
      const res = await fetch(`/api/kv/${ENROLLMENT_POLICY_KV_KEY}`);
      if (!res.ok) return;
      const data = await res.json();
      const [y, s] = data.value.split('-').map((v) => Number(v));
      if (!Number.isInteger(y) || !Number.isInteger(s)) return;
      setYear(y);
      setSemester(s);
      setIsFetching(false);
    };
    getGrantPolicy();
  }, []);

  const sendData = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(`/api/kv/${ENROLLMENT_POLICY_KV_KEY}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: `${year}-${semester}` }),
      });
      if (res.ok) {
        alert('저장에 성공했습니다.');
      } else if (res.status === 401 || res.status === 403) {
        alert('편집 권한이 없습니다.');
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (e) {
      alert('저장 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setIsFetching(false);
    }
  };

  const grantSemestersStr = useMemo(() => {
    let grantSemesters = [];
    let cy = scscGlobalStatus.year;
    let cs = scscGlobalStatus.semester;
    if (!cy || !year) return '';
    while (cy < year || (cy === year && cs <= semester)) {
      grantSemesters.push(`${cy}-${SEMESTER_MAP[cs]}학기`);
      [cy, cs] = getNextSemester(cy, cs, 1);
    }
    return grantSemesters.join(', ');
  }, [scscGlobalStatus.year, scscGlobalStatus.semester, year, semester]);

  const handleSelect = (value) => {
    const [y, s] = value.split('-').map((v) => Number(v));
    if (!Number.isInteger(y) || !Number.isInteger(s)) return;
    setYear(y);
    setSemester(s);
  };

  return (
    <div className="adm-section">
      <h3>등록 정책 관리</h3>
      {year !== undefined ? (
        <div>
          지금 등록 시
          <select value={`${year}-${semester}`} onChange={(e) => handleSelect(e.target.value)}>
            {[...Array(8).keys()].map((i) => {
              const [y, s] = getNextSemester(
                scscGlobalStatus.year,
                scscGlobalStatus.semester,
                i,
              );
              return (
                <option value={`${y}-${s}`} key={`${y}-${s}`}>
                  {y}-{SEMESTER_MAP[s]}학기
                </option>
              );
            })}
          </select>
          까지 등록됩니다.
          <br />
          <span style={{ color: '#767676' }}>
            지금 등록 시 {grantSemestersStr}에 등록됩니다.
          </span>
          <br />
          <button className="adm-button" onClick={sendData} disabled={isFetching}>
            저장
          </button>
        </div>
      ) : (
        <div>등록 정책 로딩 중</div>
      )}
    </div>
  );
}

function getNextSemester(year, semester, nextCount) {
  return [
    year + Math.floor((semester + nextCount - 1) / 4),
    ((semester + nextCount - 1) % 4) + 1,
  ];
}
