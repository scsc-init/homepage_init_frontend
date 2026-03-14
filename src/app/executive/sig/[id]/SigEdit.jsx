'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATUS_MAP, SEMESTER_MAP, SIG_ADMISSION_LABEL_MAP } from '@/util/constants';
import styles from '../../igpage.module.css';
import { directFetch } from '@/util/directFetch';

const getLeaderUserId = (sig) => {
  if (sig?.owner == null) return '';
  return String(sig.owner);
};

const renderSigEdit = (sig, ctx) => {
  const sigIdStr = String(sig.id);
  const ownerIdStr = sig?.owner != null ? String(sig.owner) : '';
  const members = Array.isArray(sig?.members) ? sig.members : [];
  const leaderId = getLeaderUserId(sig);
  const selected = ctx.selectedMember ?? leaderId;

  return (
    <>
      <tr>
        <td className={styles['adm-td']}>ID</td>
        <td className={styles['adm-td']}>{sig.id}</td>
      </tr>

      {renderSigRow(sig, ctx, 'title', '이름')}
      {renderSigRow(sig, ctx, 'description', '설명')}
      {renderSigRow(sig, ctx, 'content', '내용')}

      <tr>
        <td className={styles['adm-td']}>상태</td>
        <td className={styles['adm-td']}>
          <select
            className={styles['adm-select']}
            value={sig.status ?? ''}
            onChange={(e) => ctx.updateSigField('status', e.target.value)}
          >
            {Object.keys(STATUS_MAP).map((key) => (
              <option key={key} value={key}>
                {STATUS_MAP[key]}
              </option>
            ))}
          </select>
        </td>
      </tr>

      {renderSigRow(sig, ctx, 'year', '연도')}

      <tr>
        <td className={styles['adm-td']}>학기</td>
        <td className={styles['adm-td']}>
          <select
            className={styles['adm-select']}
            value={sig.semester ?? ''}
            onChange={(e) => ctx.updateSigField('semester', e.target.value)}
          >
            {Object.keys(SEMESTER_MAP).map((key) => (
              <option key={key} value={key}>
                {SEMESTER_MAP[key]}학기
              </option>
            ))}
          </select>
        </td>
      </tr>

      <tr>
        <td className={styles['adm-td']}>최초 생성 연도</td>
        <td className={styles['adm-td']}>{sig.created_year ?? ''}</td>
      </tr>

      <tr>
        <td className={styles['adm-td']}>최초 생성 학기</td>
        <td className={styles['adm-td']}>
          {sig.created_semester != null
            ? `${SEMESTER_MAP[Number(sig.created_semester)] ?? sig.created_semester}학기`
            : ''}
        </td>
      </tr>

      <tr>
        <td className={styles['adm-td']}>연장 신청</td>
        <td className={styles['adm-td']}>
          <select
            className={`${styles['adm-select']} ${styles['adm-select-bool']}`}
            value={String(Boolean(sig.should_extend))}
            onChange={(e) => ctx.updateSigField('should_extend', e.target.value === 'true')}
          >
            <option value="true">예</option>
            <option value="false">아니오</option>
          </select>
        </td>
      </tr>

      <tr>
        <td className={styles['adm-td']}>가입기간</td>
        <td className={styles['adm-td']}>
          <select
            className={`${styles['adm-select']} ${styles['adm-select-bool-wide']}`}
            value={String(Boolean(sig.is_rolling_admission))}
            onChange={(e) =>
              ctx.updateSigField('is_rolling_admission', e.target.value === 'true')
            }
          >
            <option value="true">예</option>
            <option value="false">아니오</option>
          </select>
        </td>
      </tr>

      <tr>
        <td className={styles['adm-td']}>SIG장</td>
        <td className={styles['adm-td']}>
          <select
            className={styles['adm-select']}
            value={selected || ''}
            onChange={(e) => ctx.setSelectedMember(e.target.value)}
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
      </tr>
    </>
  );
};

function renderSigRow(sig, ctx, attrName, attrLabel) {
  return (
    <tr>
      <td className={styles['adm-td']}>{attrLabel}</td>
      <td className={styles['adm-td']}>
        <input
          className={styles['adm-input']}
          value={sig[attrName] ?? ''}
          onChange={(e) => ctx.updateSigField(attrName, e.target.value)}
        />
      </td>
    </tr>
  );
}

export default function SigExecutiveEdit({ sig: _sig }) {
  const [saving, setSaving] = useState(false);
  const [sig, setSig] = useState(_sig);
  const [selectedMember, setSelectedMember] = useState(getLeaderUserId(sig));
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    try {
      const res1 = await directFetch(`/api/executive/sig/${sig.id}/update`, {
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
          is_rolling_admission: String(sig.is_rolling_admission),
        }),
      });
      const res2 =
        selectedMember !== getLeaderUserId(sig) &&
        (await directFetch(`/api/executive/sig/${sig.id}/handover`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ new_owner: selectedMember }),
        }));

      if (res1.status === 204 && (!res2 || res2.status === 204)) alert('저장 완료');
      else {
        const msg1 = await res1.json();
        const msg2 = res2 ? await res2.json() : undefined;
        alert(
          `저장 실패. 피그 정보 수정: ${msg1?.detail ?? res1.status}, 피그장 변경: ${!res2 || (msg2.detail ?? res2.status)}`,
        );
      }
      router.refresh();
    } catch {
      alert('저장 실패: 네트워크 오류');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setSaving(true);
    try {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      const res = await directFetch(`/api/executive/sig/${id}/delete`, { method: 'POST' });
      if (res.status === 204) {
        router.replace('/executive/sig');
      } else {
        const msg = await res.json();
        alert('삭제 실패: ' + msg.detail ?? res.status);
      }
    } catch {
      alert('삭제 실패: 네트워크 오류');
    } finally {
      setSaving(false);
    }
  };

  const updateSigField = (field, value) => {
    setSig((prev) => ({ ...prev, [field]: value }));
  };

  const rowCtx = {
    saving,
    selectedMember,
    setSelectedMember,
    updateSigField,
    handleSave,
    handleDelete,
  };

  return (
    <div>
      <table className={`${styles['adm-table']}`}>
        <colgroup>
          <col className={styles['adm-col-bool-wide']} />
          <col />
        </colgroup>
        <thead>
          <tr className={styles['adm-tr']}>
            <th className={styles['adm-th']}>속성</th>
            <th className={styles['adm-th']}>값</th>
          </tr>
        </thead>
        <tbody>{renderSigEdit(sig, rowCtx)}</tbody>
      </table>
      <div>
        <button className={styles['adm-button']} onClick={handleSave} disabled={saving}>
          저장
        </button>
        <button
          className={styles['adm-button']}
          onClick={() => handleDelete(sig.id)}
          disabled={saving}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
