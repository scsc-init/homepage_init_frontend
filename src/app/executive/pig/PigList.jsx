'use client';

import { useMemo, useState } from 'react';
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';
import styles from '../igpage.module.css';

function PigFilterRow({ filter, updateFilterCriteria }) {
  const renderBoolSelect = (field, extraClass) => {
    const selectClasses = [styles['adm-select'], styles['adm-select-bool']];
    if (extraClass) selectClasses.push(styles[extraClass]);
    return (
      <select
        className={selectClasses.join(' ')}
        value={filter[field]}
        onChange={(e) => updateFilterCriteria(field, e.target.value)}
      >
        <option value="">전체</option>
        <option value="true">예</option>
        <option value="false">아니오</option>
      </select>
    );
  };

  return (
    <tr>
      <td className={styles['adm-td']}>
        <input
          className={`${styles['adm-input']} ${styles['adm-input-id']}`}
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
      <td className={styles['adm-td']}>{renderBoolSelect('should_extend')}</td>
      <td className={styles['adm-td']}>
        {renderBoolSelect(
          'is_rolling_admission',
          styles['adm-select-bool-wide'] ? 'adm-select-bool-wide' : undefined,
        )}
      </td>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={filter.member}
          onChange={(e) => updateFilterCriteria('member', e.target.value)}
        />
      </td>
      <td className={styles['adm-td']}></td>
    </tr>
  );
}

const boolMatches = (value, filterValue) => {
  if (!filterValue) return true;
  const normalized = value ? 'true' : 'false';
  return normalized === filterValue;
};

const lower = (v) => v?.toString().toLowerCase() || '';

const getLeaderUserId = (pig) => {
  const ownerId = pig?.owner != null ? String(pig.owner) : '';
  const members = Array.isArray(pig?.members) ? pig.members : [];
  const leader = members.find((m) => String(m?.user_id) === ownerId);
  if (leader?.user_id != null) return String(leader.user_id);
  if (members[0]?.user_id != null) return String(members[0].user_id);
  return '';
};

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
    should_extend: '',
    is_rolling_admission: '',
  });

  const initialSelectedMembers = useMemo(() => {
    const m = {};
    (pigsDefault ?? []).forEach((pig) => {
      m[String(pig.id)] = getLeaderUserId(pig);
    });
    return m;
  }, [pigsDefault]);

  const [selectedMemberByPigId, setSelectedMemberByPigId] = useState(initialSelectedMembers);

  const updatePigField = (id, field, value) => {
    setPigs((prev) => prev.map((pig) => (pig.id === id ? { ...pig, [field]: value } : pig)));
    setFilteredPigs((prev) =>
      prev.map((pig) => (pig.id === id ? { ...pig, [field]: value } : pig)),
    );
  };

  const updateFilterCriteria = (field, value) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);

    const matches = (pig) =>
      (!newFilter.id || lower(pig.id).includes(lower(newFilter.id))) &&
      (!newFilter.title || lower(pig.title).includes(lower(newFilter.title))) &&
      (!newFilter.description ||
        lower(pig.description).includes(lower(newFilter.description))) &&
      (!newFilter.content || lower(pig.content).includes(lower(newFilter.content))) &&
      (!newFilter.status || pig.status?.toString() === newFilter.status.toString()) &&
      (!newFilter.year || lower(pig.year).includes(lower(newFilter.year))) &&
      (!newFilter.semester || lower(pig.semester).toString() === newFilter.semester) &&
      (!newFilter.member ||
        (pig.members ?? []).some((m) =>
          lower(m?.user?.name).includes(lower(newFilter.member)),
        )) &&
      boolMatches(Boolean(pig.should_extend), newFilter.should_extend) &&
      boolMatches(Boolean(pig.is_rolling_admission), newFilter.is_rolling_admission);

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
          should_extend: Boolean(pig.should_extend),
          is_rolling_admission: Boolean(pig.is_rolling_admission),
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
      const res = await fetch(`/api/executive/pig/${id}/delete`, { method: 'POST' });
      if (res.status === 204) {
        setPigs((prev) => prev.filter((p) => p.id !== id));
        setFilteredPigs((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('삭제 실패: ' + res.status);
      }
    } catch {
      alert('삭제 실패: 네트워크 오류');
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className={styles['adm-table-wrap']}>
      <table className={styles['adm-table']}>
        <colgroup>
          <col className={styles['adm-col-id']} />
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
          <col className={styles['adm-col-bool']} />
          <col className={styles['adm-col-bool-wide']} />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr className={styles['adm-tr']}>
            <th className={styles['adm-th']}>ID</th>
            <th className={styles['adm-th']}>이름</th>
            <th className={styles['adm-th']}>설명</th>
            <th className={styles['adm-th']}>내용</th>
            <th className={styles['adm-th']}>상태</th>
            <th className={styles['adm-th']}>연도</th>
            <th className={styles['adm-th']}>학기</th>
            <th className={styles['adm-th']}>연장 신청</th>
            <th className={styles['adm-th']}>가입기간 자유화</th>
            <th className={styles['adm-th']}>구성원</th>
            <th className={styles['adm-th']}>작업</th>
          </tr>
          <PigFilterRow filter={filter} updateFilterCriteria={updateFilterCriteria} />
        </thead>
        <tbody>
          {filteredPigs.map((pig) => {
            const pigIdStr = String(pig.id);
            const ownerIdStr = pig?.owner != null ? String(pig.owner) : '';
            const members = Array.isArray(pig?.members) ? pig.members : [];
            const leaderId = getLeaderUserId(pig);
            const selected = selectedMemberByPigId[pigIdStr] ?? leaderId;

            return (
              <tr key={pig.id} className={styles['adm-tr']}>
                <td className={styles['adm-td']}>{pig.id}</td>

                <td className={styles['adm-td']}>
                  <input
                    className={styles['adm-input']}
                    value={pig.title ?? ''}
                    onChange={(e) => updatePigField(pig.id, 'title', e.target.value)}
                  />
                </td>

                <td className={styles['adm-td']}>
                  <input
                    className={styles['adm-input']}
                    value={pig.description ?? ''}
                    onChange={(e) => updatePigField(pig.id, 'description', e.target.value)}
                  />
                </td>

                <td className={styles['adm-td']}>
                  <input
                    className={styles['adm-input']}
                    value={pig.content ?? ''}
                    onChange={(e) => updatePigField(pig.id, 'content', e.target.value)}
                  />
                </td>

                <td className={styles['adm-td']}>
                  <select
                    className={styles['adm-select']}
                    value={pig.status ?? ''}
                    onChange={(e) => updatePigField(pig.id, 'status', e.target.value)}
                  >
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
                    value={pig.year ?? ''}
                    onChange={(e) => updatePigField(pig.id, 'year', e.target.value)}
                  />
                </td>

                <td className={styles['adm-td']}>
                  <select
                    className={styles['adm-select']}
                    value={pig.semester ?? ''}
                    onChange={(e) => updatePigField(pig.id, 'semester', e.target.value)}
                  >
                    {Object.keys(SEMESTER_MAP).map((key) => (
                      <option key={key} value={key}>
                        {SEMESTER_MAP[key]}학기
                      </option>
                    ))}
                  </select>
                </td>

                <td className={styles['adm-td']}>
                  <select
                    className={`${styles['adm-select']} ${styles['adm-select-bool']}`}
                    value={String(Boolean(pig.should_extend))}
                    onChange={(e) =>
                      updatePigField(pig.id, 'should_extend', e.target.value === 'true')
                    }
                  >
                    <option value="true">예</option>
                    <option value="false">아니오</option>
                  </select>
                </td>

                <td className={styles['adm-td']}>
                  <select
                    className={`${styles['adm-select']} ${styles['adm-select-bool']} ${styles['adm-select-bool-wide']}`}
                    value={String(Boolean(pig.is_rolling_admission))}
                    onChange={(e) =>
                      updatePigField(pig.id, 'is_rolling_admission', e.target.value === 'true')
                    }
                  >
                    <option value="true">예</option>
                    <option value="false">아니오</option>
                  </select>
                </td>

                <td className={styles['adm-td']}>
                  <select
                    className={styles['adm-select']}
                    value={selected || ''}
                    onChange={(e) =>
                      setSelectedMemberByPigId((prev) => ({
                        ...prev,
                        [pigIdStr]: e.target.value,
                      }))
                    }
                  >
                    {members.length === 0 ? <option value="">(없음)</option> : null}
                    {members.map((m) => {
                      const mid = m?.user_id != null ? String(m.user_id) : '';
                      const name = m?.user?.name ?? '';
                      const label = mid && mid === ownerIdStr ? `[PIG장] ${name}` : name;
                      return (
                        <option key={mid || name} value={mid}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </td>

                <td className={styles['adm-td']}>
                  <button
                    className={styles['adm-button']}
                    onClick={() => handleSave(pig)}
                    disabled={Boolean(saving[pig.id])}
                  >
                    저장
                  </button>
                  <button
                    className={styles['adm-button']}
                    onClick={() => handleDelete(pig.id)}
                    disabled={Boolean(saving[pig.id])}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
