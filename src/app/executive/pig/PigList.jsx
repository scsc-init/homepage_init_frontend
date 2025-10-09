'use client';

import { useState } from 'react';
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';
import EntryRow from '../EntryRow.jsx';
import styles from '../igpage.module.css';

function PigFilterRow({ filter, updateFilterCriteria }) {
  return (
    <tr>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={filter.id}
          onChange={(e) => updateFilterCriteria('id', e.target.value)}
        />
      </td>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={filter.title}
          onChange={(e) => updateFilterCriteria('title', e.target.value)}
        />
      </td>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={filter.description}
          onChange={(e) => updateFilterCriteria('description', e.target.value)}
        />
      </td>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={filter.content}
          onChange={(e) => updateFilterCriteria('content', e.target.value)}
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
          value={filter.member}
          onChange={(e) => updateFilterCriteria('member', e.target.value)}
        />
      </td>
    </tr>
  );
}

export default function PigList({ pigs: pigsDefault }) {
  const [pigs, setPigs] = useState(pigsDefault ?? []);
  const [filteredPigs, setFilteredPigs] = useState(pigsDefault ?? []);
  const [saving, setSaving] = useState({});
  const [filter, setFilter] = useState({
    id: '',
    title: '',
    description: '',
    content: '',
    status: '',
    year: '',
    semester: '',
    member: '',
  });

  const updatePigField = (id, field, value) => {
    setPigs((prev) => prev.map((pig) => (pig.id === id ? { ...pig, [field]: value } : pig)));
    setFilteredPigs((prev) =>
      prev.map((pig) => (pig.id === id ? { ...pig, [field]: value } : pig)),
    );
  };

  const updateFilterCriteria = (field, value) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);
    const lower = (v) => v?.toString().toLowerCase() || '';
    const matches = (pig) =>
      (!newFilter.id || lower(pig.id).includes(lower(newFilter.id))) &&
      (!newFilter.title || lower(pig.title).includes(lower(newFilter.title))) &&
      (!newFilter.description ||
        lower(pig.description).includes(lower(newFilter.description))) &&
      (!newFilter.content || lower(pig.content).includes(lower(newFilter.content))) &&
      (!newFilter.status || pig.status.toString() === newFilter.status.toString()) &&
      (!newFilter.year || lower(pig.year).includes(lower(newFilter.year))) &&
      (!newFilter.semester || lower(pig.semester).toString() === newFilter.semester) &&
      (!newFilter.member ||
        pig.members.some((m) => lower(m.user.name).includes(lower(newFilter.member))));
    setFilteredPigs(pigs.filter(matches));
  };

  const handleSave = async (pig) => {
    setSaving((prev) => ({ ...prev, [pig.id]: true }));
    try {
      const res = await fetch(`/api/executive/pig/${pig.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pig.title,
          description: pig.description,
          content: pig.content,
          status: pig.status,
          year: pig.year,
          semester: pig.semester,
        }),
      });
      if (res.status === 204) alert('저장 완료');
      else alert('저장 실패: ' + res.status);
    } catch {
      alert('저장 실패: 네트워크 오류');
    } finally {
      setSaving((prev) => ({ ...prev, [pig.id]: false }));
    }
  };

  const handleDelete = async (id) => {
    setSaving((prev) => ({ ...prev, [id]: true }));
    try {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      const res = await fetch(`/api/executive/pig/${id}/delete`, {
        method: 'POST',
      });
      if (res.status === 204) {
        setPigs((prev) => prev.filter((p) => p.id !== id));
        setFilteredPigs((prev) => prev.filter((p) => p.id !== id));
      } else alert('삭제 실패: ' + res.status);
    } catch {
      alert('저장 실패: 네트워크 오류');
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className={styles['adm-table-wrap']}>
      <table className={styles['adm-table']}>
        <thead>
          <tr className={styles['adm-tr']}>
            <th className={styles['adm-th']}>ID</th>
            <th className={styles['adm-th']}>이름</th>
            <th className={styles['adm-th']}>설명</th>
            <th className={styles['adm-th']}>내용</th>
            <th className={styles['adm-th']}>상태</th>
            <th className={styles['adm-th']}>연도</th>
            <th className={styles['adm-th']}>학기</th>
            <th className={styles['adm-th']}>구성원</th>
            <th className={styles['adm-th']}>작업</th>
          </tr>
          <PigFilterRow filter={filter} updateFilterCriteria={updateFilterCriteria} />
        </thead>
        <tbody>
          {filteredPigs.map((pig) => (
            <EntryRow
              key={pig.id}
              entry={pig}
              onChange={updatePigField}
              onSave={handleSave}
              onDelete={handleDelete}
              saving={saving}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
