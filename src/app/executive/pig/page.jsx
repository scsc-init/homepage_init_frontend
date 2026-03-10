// src/app/executive/pig/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import WithAuthorization from '@/components/WithAuthorization';
import { SEMESTER_MAP } from '@/util/constants';
import styles from '../igpage.module.css';

export default function ExecutivePigPage() {
  const [pigs, setPigs] = useState([]);
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
        const pigRes = await fetch(`/api/pigs?${query.toString()}`);
        if (!pigRes.ok) throw new Error('pigs');
        const pigList = await pigRes.json();

        if (!cancelled) {
          setTerm({ year: status.year, semester: status.semester });
          setPigs(Array.isArray(pigList) ? pigList : []);
        }
      } catch {
        if (!cancelled) setError('PIG 목록을 불러오지 못했습니다.');
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
        <h2>PIG 관리</h2>
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
                    {pigs.map((pig) => (
                      <tr key={pig.id}>
                        <td className={styles['adm-td']}>{pig.id}</td>
                        <td className={styles['adm-td']}>{pig.title}</td>
                        <td className={styles['adm-td']}>{pig.status}</td>
                        <td className={styles['adm-td']}>
                          {pig.year}년 {SEMESTER_MAP[pig.semester] ?? pig.semester}학기
                        </td>
                        <td className={styles['adm-td']}>
                          <Link className={styles['adm-button']} href={`/pig/edit/${pig.id}`}>
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
