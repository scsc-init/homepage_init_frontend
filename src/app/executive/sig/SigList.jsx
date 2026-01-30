'use client';

import { useMemo, useState } from 'react';
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';
import styles from '../igpage.module.css';

function SigFilterRow({ filter, updateFilterCriteria }) {
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

const getLeaderUserId = (sig) => {
  if (sig?.owner == null) return '';
  return String(sig.owner);
};

const renderSigRow = (sig, ctx) => {
  const sigIdStr = String(sig.id);
  const ownerIdStr = sig?.owner != null ? String(sig.owner) : '';
  const members = Array.isArray(sig?.members) ? sig.members : [];
  const leaderId = getLeaderUserId(sig);
  const selected = ctx.selectedMemberBySigId[sigIdStr] ?? leaderId;

  return (
    <tr key={sig.id} className={styles['adm-tr']}>
      <td className={styles['adm-td']}>{sig.id}</td>

      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={sig.title ?? ''}
          onChange={(e) => ctx.updateSigField(sig.id, 'title', e.target.value)}
        />
      </td>

      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={sig.description ?? ''}
          onChange={(e) => ctx.updateSigField(sig.id, 'description', e.target.value)}
        />
      </td>

      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={sig.content ?? ''}
          onChange={(e) => ctx.updateSigField(sig.id, 'content', e.target.value)}
        />
      </td>

      <td className={styles['adm-td']}>
        <select
          className={styles['adm-select']}
          value={sig.status ?? ''}
          onChange={(e) => ctx.updateSigField(sig.id, 'status', e.target.value)}
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
          value={sig.year ?? ''}
          onChange={(e) => ctx.updateSigField(sig.id, 'year', e.target.value)}
        />
      </td>

      <td className={styles['adm-td']}>
        <select
          className={styles['adm-select']}
          value={sig.semester ?? ''}
          onChange={(e) => ctx.updateSigField(sig.id, 'semester', e.target.value)}
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
          value={String(Boolean(sig.should_extend))}
          onChange={(e) =>
            ctx.updateSigField(sig.id, 'should_extend', e.target.value === 'true')
          }
        >
          <option value="true">예</option>
          <option value="false">아니오</option>
        </select>
      </td>

      <td className={styles['adm-td']}>
        <select
          className={`${styles['adm-select']} ${styles['adm-select-bool']} ${styles['adm-select-bool-wide']}`}
          value={String(Boolean(sig.is_rolling_admission))}
          onChange={(e) =>
            ctx.updateSigField(sig.id, 'is_rolling_admission', e.target.value === 'true')
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
            ctx.setSelectedMemberBySigId((prev) => ({
              ...prev,
              [sigIdStr]: e.target.value,
            }))
          }
        >
          {members.length === 0 ? <option value="">(없음)</option> : null}
          {members.map((m, idx) => {
            const mid = m?.user_id != null ? String(m.user_id) : '';
            const name = m?.user?.name ?? '';
            const label = mid && mid === ownerIdStr ? `[SIG장] ${name}` : name;
            return (
              <option key={`${sigIdStr}-${mid || name}-${idx}`} value={mid}>
                {label}
              </option>
            );
          })}
        </select>
      </td>

      <td className={styles['adm-td']}>
        <button
          className={styles['adm-button']}
          onClick={() => ctx.handleSave(sig)}
          disabled={Boolean(ctx.saving[sig.id])}
        >
          저장
        </button>
        <button
          className={styles['adm-button']}
          onClick={() => ctx.handleDelete(sig.id)}
          disabled={Boolean(ctx.saving[sig.id])}
        >
          삭제
        </button>
      </td>
    </tr>
  );
};

export default function SigList({ sigs: sigsDefault }) {
  const [sigs, setSigs] = useState(sigsDefault ?? []);
  const [filteredSigs, setFilteredSigs] = useState(sigsDefault ?? []);
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
    (sigsDefault ?? []).forEach((sig) => {
      m[String(sig.id)] = getLeaderUserId(sig);
    });
    return m;
  }, [sigsDefault]);

  const [selectedMemberBySigId, setSelectedMemberBySigId] = useState(initialSelectedMembers);

  const updateSigField = (id, field, value) => {
    setSigs((prev) => prev.map((sig) => (sig.id === id ? { ...sig, [field]: value } : sig)));
    setFilteredSigs((prev) =>
      prev.map((sig) => (sig.id === id ? { ...sig, [field]: value } : sig)),
    );
  };

  const updateFilterCriteria = (field, value) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);

    const matches = (sig) =>
      (!newFilter.id || lower(sig.id).includes(lower(newFilter.id))) &&
      (!newFilter.title || lower(sig.title).includes(lower(newFilter.title))) &&
      (!newFilter.description ||
        lower(sig.description).includes(lower(newFilter.description))) &&
      (!newFilter.content || lower(sig.content).includes(lower(newFilter.content))) &&
      (!newFilter.status || sig.status?.toString() === newFilter.status.toString()) &&
      (!newFilter.year || lower(sig.year).includes(lower(newFilter.year))) &&
      (!newFilter.semester || lower(sig.semester).toString() === newFilter.semester) &&
      (!newFilter.member ||
        (sig.members ?? []).some((m) =>
          lower(m?.user?.name).includes(lower(newFilter.member)),
        )) &&
      boolMatches(Boolean(sig.should_extend), newFilter.should_extend) &&
      boolMatches(Boolean(sig.is_rolling_admission), newFilter.is_rolling_admission);

    setFilteredSigs(sigs.filter(matches));
  };

  const handleSave = async (sig) => {
    setSaving((prev) => ({ ...prev, [sig.id]: true }));
    try {
      const res = await fetch(`/api/executive/sig/${sig.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sig.title,
          description: sig.description,
          content: sig.content,
          status: sig.status,
          year: sig.year,
          semester: sig.semester,
          should_extend: Boolean(sig.should_extend),
          is_rolling_admission: Boolean(sig.is_rolling_admission),
        }),
      });
      if (res.status === 204) alert('저장 완료');
      else alert('저장 실패: ' + res.status);
    } catch {
      alert('저장 실패: 네트워크 오류');
    } finally {
      setSaving((prev) => ({ ...prev, [sig.id]: false }));
    }
  };

  const handleDelete = async (id) => {
    setSaving((prev) => ({ ...prev, [id]: true }));
    try {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      const res = await fetch(`/api/executive/sig/${id}/delete`, { method: 'POST' });
      if (res.status === 204) {
        setSigs((prev) => prev.filter((p) => p.id !== id));
        setFilteredSigs((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('삭제 실패: ' + res.status);
      }
    } catch {
      alert('삭제 실패: 네트워크 오류');
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const rowCtx = {
    saving,
    selectedMemberBySigId,
    setSelectedMemberBySigId,
    updateSigField,
    handleSave,
    handleDelete,
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
          <SigFilterRow filter={filter} updateFilterCriteria={updateFilterCriteria} />
        </thead>
        <tbody>{filteredSigs.map((sig) => renderSigRow(sig, rowCtx))}</tbody>
      </table>
    </div>
  );
}
