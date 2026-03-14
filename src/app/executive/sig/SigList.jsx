'use client';

import { useState } from 'react';
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';
import styles from '../igpage.module.css';

function SigFilterRow({ filter, updateFilterCriteria }) {
  return (
    <tr>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={filter.title}
          onChange={(e) => updateFilterCriteria('title', e.target.value)}
        />
      </td>
      <td className={styles['adm-td']}>
        <select
          className={styles['adm-select']}
          value={filter.status}
          onChange={(e) => updateFilterCriteria('status', e.target.value)}
        >
          <option value="">상태 전체</option>
          {Object.keys(STATUS_MAP).map((key) => (
            <option key={key} value={key}>
              {STATUS_MAP[key]}
            </option>
          ))}
        </select>
      </td>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={filter.year}
          onChange={(e) => updateFilterCriteria('year', e.target.value)}
        />
      </td>
      <td className={styles['adm-td']}>
        <select
          className={styles['adm-select']}
          value={filter.semester}
          onChange={(e) => updateFilterCriteria('semester', e.target.value)}
        >
          <option value="">학기 전체</option>
          {Object.keys(SEMESTER_MAP).map((key) => (
            <option key={key} value={key}>
              {SEMESTER_MAP[key]}학기
            </option>
          ))}
        </select>
      </td>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={filter.ownerName}
          onChange={(e) => updateFilterCriteria('ownerName', e.target.value)}
        />
      </td>
      <td className={styles['adm-td']}></td>
    </tr>
  );
}

const RenderSigRow = ({ sig }) => {
  return (
    <tr key={sig.id} className={styles['adm-tr']}>
      <td className={styles['adm-td']}>{sig.title ?? ''}</td>
      <td className={styles['adm-td']}>{STATUS_MAP[sig.status] ?? ''}</td>
      <td className={styles['adm-td']}>{sig.year ?? ''}</td>
      <td className={styles['adm-td']}>{SEMESTER_MAP[Number(sig.semester)] ?? ''}학기</td>
      <td className={styles['adm-td']}>{sig.ownerName ?? ''}</td>
      <td className={styles['adm-td']}>
        <a href={`/executive/sig/${sig.id}`}>상세보기</a>
      </td>
    </tr>
  );
};

const lower = (v) => v?.toString().toLowerCase() || '';

export default function SigList({ sigs }) {
  const [filteredSigs, setFilteredSigs] = useState(sigs ?? []);
  const [filter, setFilter] = useState({
    title: '',
    status: '',
    year: '',
    semester: '',
    ownerName: '',
  });

  const updateFilterCriteria = (field, value) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);

    const matches = (sig) =>
      (!newFilter.title || lower(sig.title).includes(lower(newFilter.title))) &&
      (!newFilter.status || sig.status?.toString() === newFilter.status.toString()) &&
      (!newFilter.year || lower(sig.year).includes(lower(newFilter.year))) &&
      (!newFilter.semester || lower(sig.semester).toString() === newFilter.semester) &&
      (!newFilter.ownerName || lower(sig.ownerName).includes(lower(newFilter.ownerName)));

    setFilteredSigs(sigs.filter(matches));
  };

  return (
    <table className={styles['adm-table']}>
      <colgroup>
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr className={styles['adm-tr']}>
          <th className={styles['adm-th']}>이름</th>
          <th className={styles['adm-th']}>상태</th>
          <th className={styles['adm-th']}>연도</th>
          <th className={styles['adm-th']}>학기</th>
          <th className={styles['adm-th']}>SIG장</th>
          <th className={styles['adm-th']}>상세보기</th>
        </tr>
        <SigFilterRow filter={filter} updateFilterCriteria={updateFilterCriteria} />
      </thead>
      <tbody>
        {filteredSigs.map((sig) => (
          <RenderSigRow sig={sig} key={sig.id} />
        ))}
      </tbody>
    </table>
  );
}
