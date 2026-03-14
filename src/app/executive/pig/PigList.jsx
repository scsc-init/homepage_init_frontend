'use client';

import { useState } from 'react';
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';
import styles from '../igpage.module.css';

function PigFilterRow({ filter, updateFilterCriteria }) {
  return (
    <tr className={styles['adm-tr-filter']}>
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
          <option value="">전체</option>
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

const RenderPigRow = ({ pig }) => {
  return (
    <tr key={pig.id} className={styles['adm-tr']}>
      <td className={styles['adm-td']}>{pig.title ?? ''}</td>
      <td className={styles['adm-td']}>{STATUS_MAP[pig.status] ?? ''}</td>
      <td className={styles['adm-td']}>{pig.year ?? ''}</td>
      <td className={styles['adm-td']}>{SEMESTER_MAP[Number(pig.semester)] ?? ''}학기</td>
      <td className={styles['adm-td']}>{pig.ownerName ?? ''}</td>
      <td className={styles['adm-td']}>
        <a href={`/executive/pig/${pig.id}`}>상세보기</a>
      </td>
    </tr>
  );
};

const lower = (v) => v?.toString().toLowerCase() || '';

export default function PigList({ pigs }) {
  const [filteredPigs, setFilteredPigs] = useState(pigs ?? []);
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

    const matches = (pig) =>
      (!newFilter.title || lower(pig.title).includes(lower(newFilter.title))) &&
      (!newFilter.status || pig.status?.toString() === newFilter.status.toString()) &&
      (!newFilter.year || lower(pig.year).includes(lower(newFilter.year))) &&
      (!newFilter.semester || lower(pig.semester).toString() === newFilter.semester) &&
      (!newFilter.ownerName || lower(pig.ownerName).includes(lower(newFilter.ownerName)));

    setFilteredPigs(pigs.filter(matches));
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
          <th className={styles['adm-th']}>PIG장</th>
          <th className={styles['adm-th']}>상세보기</th>
        </tr>
        <PigFilterRow filter={filter} updateFilterCriteria={updateFilterCriteria} />
      </thead>
      <tbody>
        {filteredPigs.map((pig) => (
          <RenderPigRow pig={pig} key={pig.id} />
        ))}
      </tbody>
    </table>
  );
}
