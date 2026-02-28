// src/app/executive/sig/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import WithAuthorization from '@/components/WithAuthorization';
import { SEMESTER_MAP } from '@/util/constants';
import styles from '../igpage.module.css';

export default function ExecutiveSigPage() {
  const [sigs, setSigs] = useState([]);
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const statusRes = await fetch('/api/scsc/global/status');
        if (!statusRes.ok) throw new Error('global-status');
        const status = await statusRes.json();
        if (!status?.year || !status?.semester) throw new Error('term');

        const query = new URLSearchParams({
          year: String(status.year),
          semester: String(status.semester),
        });
        const sigRes = await fetch(`/api/sigs?${query.toString()}`);
        if (!sigRes.ok) throw new Error('sigs');
        const sigList = await sigRes.json();

        if (!cancelled) {
          setTerm({ year: status.year, semester: status.semester });
          setSigs(Array.isArray(sigList) ? sigList : []);
        }
      } catch {
        if (!cancelled) setError('SIG 목록을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const termLabel = term
    ? `${term.year}년 ${SEMESTER_MAP[term.semester] ?? term.semester}학기`
    : '';

  return (
    <WithAuthorization>
      <div className={styles['admin-panel']}>
        <h2>SIG 관리</h2>
        <div className={styles['adm-section']}>
          {loading ? (
            <p>불러오는 중...</p>
          ) : error ? (
            <p style={{ color: 'crimson' }}>{error}</p>
          ) : (
            <>
              {termLabel ? <p>현재 학기: {termLabel}</p> : null}
              <div className={styles['adm-table-wrap']}>
                <table className={styles['adm-table']}>
                  <thead>
                    <tr className={styles['adm-tr']}>
                      <th className={styles['adm-th']}>ID</th>
                      <th className={styles['adm-th']}>이름</th>
                      <th className={styles['adm-th']}>상태</th>
                      <th className={styles['adm-th']}>학기</th>
                      <th className={styles['adm-th']}>수정</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sigs.map((sig) => (
                      <tr key={sig.id}>
                        <td className={styles['adm-td']}>{sig.id}</td>
                        <td className={styles['adm-td']}>{sig.title}</td>
                        <td className={styles['adm-td']}>{sig.status}</td>
                        <td className={styles['adm-td']}>
                          {sig.year}년 {SEMESTER_MAP[sig.semester] ?? sig.semester}학기
                        </td>
                        <td className={styles['adm-td']}>
                          <Link className={styles['adm-button']} href={`/sig/edit/${sig.id}`}>
                            수정 페이지
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </WithAuthorization>
  );
}
