// src/app/executive/pig/page.jsx
'use client';

import { useEffect, useState } from 'react';
import WithAuthorization from '@/components/WithAuthorization';
import PigList from './PigList';
import PigMembersPanel from './PigMembersPanel';
import { SEMESTER_MAP } from '@/util/constants';
import styles from '../igpage.module.css';

export default function ExecutivePigPage() {
  const [pigs, setPigs] = useState([]);
  const [users, setUsers] = useState([]);
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

        const [pigRes, userRes] = await Promise.all([
          fetch(`/api/pigs?${query.toString()}`),
          fetch('/api/executive/users'),
        ]);

        if (!pigRes.ok) throw new Error('pigs');
        if (!userRes.ok) throw new Error('users');

        const [pigList, userList] = await Promise.all([pigRes.json(), userRes.json()]);

        if (!cancelled) {
          setTerm({ year: status.year, semester: status.semester });
          setPigs(Array.isArray(pigList) ? pigList : []);
          setUsers(Array.isArray(userList) ? userList : []);
        }
      } catch {
        if (!cancelled) setError('PIG/사용자 데이터를 불러오지 못했습니다.');
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

  const pigList = Array.isArray(pigs) ? pigs : [];
  const userList = Array.isArray(users) ? users : [];

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
              <PigList pigs={pigList} />
            </>
          )}
        </div>
        <h2>PIG 구성원 관리</h2>
        <div className={styles['adm-section']}>
          {loading ? (
            <p>불러오는 중...</p>
          ) : error ? (
            <p style={{ color: 'crimson' }}>{error}</p>
          ) : (
            <PigMembersPanel pigs={pigList} users={userList} />
          )}
        </div>
      </div>
    </WithAuthorization>
  );
}
