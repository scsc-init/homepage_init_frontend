'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import * as AdminLayout from '@/app/executive/AdminLayout';
import { getKvClient, setKvClient } from '@/util/fetch/client-util';

const ENROLLMENT_POLICY_KV_KEY = `enrollment_grant_until`;
export default function EnrollmentPolicyPanel({ scscGlobalStatus }) {
  const t = useTranslations('Executive');
  const semesterLabels = t.raw('semesters');
  const [isFetching, setIsFetching] = useState(true);
  const [year, setYear] = useState();
  const [semester, setSemester] = useState();
  useEffect(() => {
    const getGrantPolicy = async () => {
      const value = await getKvClient(ENROLLMENT_POLICY_KV_KEY).catch(() => '');
      if (!value) return;
      const [y, s] = value.split('-').map((v) => Number(v));
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
      const res = await setKvClient(ENROLLMENT_POLICY_KV_KEY, `${year}-${semester}`);
      if (res.ok) {
        alert(t('saveSucceeded'));
      } else if (res.status === 401 || res.status === 403) {
        alert(t('noEditPermission'));
      } else {
        alert(t('saveError'));
      }
    } catch (e) {
      alert(t('saveFailedPrefix') + (e?.message || t('networkError')));
    } finally {
      setIsFetching(false);
    }
  };

  const grantSemestersStr = useMemo(() => {
    let grantSemesters = [];
    let cy = scscGlobalStatus?.year;
    let cs = scscGlobalStatus?.semester;
    if (!cy || !year) return '';
    while (cy < year || (cy === year && cs <= semester)) {
      grantSemesters.push(
        t('yearSemester', { value0: String(cy), value1: String(semesterLabels[cs]) }),
      );
      [cy, cs] = getNextSemester(cy, cs, 1);
    }
    return grantSemesters.join(', ');
  }, [scscGlobalStatus?.year, scscGlobalStatus?.semester, year, semester, t, semesterLabels]);

  const handleSelect = (value) => {
    const [y, s] = value.split('-').map((v) => Number(v));
    if (!Number.isInteger(y) || !Number.isInteger(s)) return;
    setYear(y);
    setSemester(s);
  };

  if (!scscGlobalStatus) {
    return (
      <AdminLayout.AdminSection>
        <h3>{t('enrollmentPolicy')}</h3>
        <div>{t('statusLoadFailed')}</div>
      </AdminLayout.AdminSection>
    );
  }

  if (year === undefined || semester === undefined) {
    return (
      <AdminLayout.AdminSection>
        <h3>{t('enrollmentPolicy')}</h3>
        <div>{t('enrollmentPolicyLoading')}</div>
      </AdminLayout.AdminSection>
    );
  }

  return (
    <AdminLayout.AdminSection>
      <h3>{t('enrollmentPolicy')}</h3>
      <div>
        {t('enrollmentStart')}{' '}
        <select value={`${year}-${semester}`} onChange={(e) => handleSelect(e.target.value)}>
          {[...Array(8).keys()].map((i) => {
            const [y, s] = getNextSemester(scscGlobalStatus.year, scscGlobalStatus.semester, i);
            return (
              <option value={`${y}-${s}`} key={`${y}-${s}`}>
                {t('yearSemester', { value0: String(y), value1: String(semesterLabels[s]) })}
              </option>
            );
          })}
        </select>
        {t('enrollmentEnd')} <br />
        <span style={{ color: '#767676' }}>
          {t('enrollmentSemesters', { value0: grantSemestersStr ?? '' })}
        </span>
        <br />
        <AdminLayout.AdminButton onClick={sendData} disabled={isFetching}>
          {t('save')}
        </AdminLayout.AdminButton>
      </div>
    </AdminLayout.AdminSection>
  );
}

function getNextSemester(year, semester, nextCount) {
  return [
    year + Math.floor((semester + nextCount - 1) / 4),
    ((semester + nextCount - 1) % 4) + 1,
  ];
}
