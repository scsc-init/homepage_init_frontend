'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATUS_MAP, SEMESTER_MAP, PIG_ADMISSION_LABEL_MAP } from '@/util/constants';
import * as AdminLayout from '@/components/AdminLayout';

const getLeaderUserId = (pig) => {
  if (pig?.owner == null) return '';
  return String(pig.owner);
};

const renderPigEdit = (pig, ctx) => {
  const pigIdStr = String(pig.id);
  const ownerIdStr = pig?.owner != null ? String(pig.owner) : '';
  const members = Array.isArray(pig?.members) ? pig.members : [];
  const leaderId = getLeaderUserId(pig);
  const selected = ctx.selectedMember ?? leaderId;

  return (
    <>
      <tr>
        <td>ID</td>
        <td>{pig.id}</td>
      </tr>

      {renderPigRow(pig, ctx, 'title', '이름')}
      {renderPigRow(pig, ctx, 'description', '설명')}
      {renderPigRow(pig, ctx, 'content', '내용')}

      <tr>
        <td>상태</td>
        <td>
          <AdminLayout.AdminSelect
            value={pig.status ?? ''}
            onChange={(e) => ctx.updatePigField('status', e.target.value)}
          >
            {Object.keys(STATUS_MAP).map((key) => (
              <option key={key} value={key}>
                {STATUS_MAP[key]}
              </option>
            ))}
          </AdminLayout.AdminSelect>
        </td>
      </tr>

      {renderPigRow(pig, ctx, 'year', '연도')}

      <tr>
        <td>학기</td>
        <td>
          <AdminLayout.AdminSelect
            value={pig.semester ?? ''}
            onChange={(e) => ctx.updatePigField('semester', e.target.value)}
          >
            {Object.keys(SEMESTER_MAP).map((key) => (
              <option key={key} value={key}>
                {SEMESTER_MAP[key]}학기
              </option>
            ))}
          </AdminLayout.AdminSelect>
        </td>
      </tr>

      <tr>
        <td>최초 생성 연도</td>
        <td>{pig.created_year ?? ''}</td>
      </tr>

      <tr>
        <td>최초 생성 학기</td>
        <td>
          {pig.created_semester != null
            ? `${SEMESTER_MAP[Number(pig.created_semester)] ?? pig.created_semester}학기`
            : ''}
        </td>
      </tr>

      <tr>
        <td>연장 신청</td>
        <td>
          <AdminLayout.AdminSelectBool
            value={String(Boolean(pig.should_extend))}
            onChange={(e) => ctx.updatePigField('should_extend', e.target.value === 'true')}
          >
            <option value="true">예</option>
            <option value="false">아니오</option>
          </AdminLayout.AdminSelectBool>
        </td>
      </tr>

      <tr>
        <td>가입기간</td>
        <td>
          <AdminLayout.AdminSelectBoolWide
            value={pig['is_rolling_admission'] ?? ''}
            onChange={(e) => ctx.updatePigField('is_rolling_admission', e.target.value)}
          >
            <option value="always">{PIG_ADMISSION_LABEL_MAP.always}</option>
            <option value="never">{PIG_ADMISSION_LABEL_MAP.never}</option>
            <option value="during_recruiting">
              {PIG_ADMISSION_LABEL_MAP.during_recruiting}
            </option>
          </AdminLayout.AdminSelectBoolWide>
        </td>
      </tr>

      <tr>
        <td>PIG장</td>
        <td>
          <AdminLayout.AdminSelect
            value={selected || ''}
            onChange={(e) => ctx.setSelectedMember(e.target.value)}
          >
            {members.length === 0 ? <option value="">(없음)</option> : null}
            {members.map((m, idx) => {
              const mid = m?.user_id != null ? String(m.user_id) : '';
              const name = m?.user?.name ?? '';
              const label = mid && mid === ownerIdStr ? `[PIG장] ${name}` : name;
              return (
                <option key={`${pigIdStr}-${mid || name}-${idx}`} value={mid}>
                  {label}
                </option>
              );
            })}
          </AdminLayout.AdminSelect>
        </td>
      </tr>
    </>
  );
};

function renderPigRow(pig, ctx, attrName, attrLabel) {
  return (
    <tr>
      <td>{attrLabel}</td>
      <td>
        <AdminLayout.AdminInput
          value={pig[attrName] ?? ''}
          onChange={(e) => ctx.updatePigField(attrName, e.target.value)}
        />
      </td>
    </tr>
  );
}

export default function PigExecutiveEdit({ pig: _pig }) {
  const [saving, setSaving] = useState(false);
  const [pig, setPig] = useState(_pig);
  const [selectedMember, setSelectedMember] = useState(getLeaderUserId(pig));
  const router = useRouter();

  const handleSave = async () => {
    try {
      setSaving(true);
      const res1 = await fetchBackendClient(`/api/executive/sig/${pig.id}/update`, {
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
          is_rolling_admission: String(pig.is_rolling_admission),
        }),
      });
      if (!res1.ok) {
        const msg1 = await res1.json();
        alert(`저장 실패. PIG 정보 수정: ${msg1?.detail ?? res1.status}`);
        setSaving(false);
        return;
      }

      let res2 = null;
      if (selectedMember !== getLeaderUserId(pig)) {
        res2 = await fetchBackendClient(`/api/executive/sig/${pig.id}/handover`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ new_owner: selectedMember }),
        });
      }
      if (!res2 || res2.ok) alert('저장 완료');
      else {
        const msg2 = res2 ? await res2.json() : undefined;
        alert(`저장 실패. PIG장 변경: ${!res2 || (msg2.detail ?? res2.status)}`);
      }
      router.refresh();
    } catch {
      alert('저장 실패: 네트워크 오류');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      setSaving(true);
      const res = await fetchBackendClient(`/api/executive/sig/${id}/delete`, {
        method: 'POST',
      });
      if (res.status === 204) {
        router.replace('/executive/pig');
      } else {
        const msg = await res.json();
        alert('삭제 실패: ' + (msg.detail ?? res.status));
      }
    } catch {
      alert('삭제 실패: 네트워크 오류');
    } finally {
      setSaving(false);
    }
  };

  const updatePigField = (field, value) => {
    setPig((prev) => ({ ...prev, [field]: value }));
  };

  const rowCtx = {
    saving,
    selectedMember,
    setSelectedMember,
    updatePigField,
    handleSave,
    handleDelete,
  };

  return (
    <div>
      <AdminLayout.AdminTable>
        <colgroup>
          <AdminLayout.AdminColBoolWide />
        </colgroup>
        <thead>
          <tr>
            <th>속성</th>
            <th>값</th>
          </tr>
        </thead>
        <tbody>{renderPigEdit(pig, rowCtx)}</tbody>
      </AdminLayout.AdminTable>
      <div>
        <AdminLayout.AdminButton onClick={handleSave} disabled={saving}>
          저장
        </AdminLayout.AdminButton>
        <AdminLayout.AdminButton onClick={() => handleDelete(pig.id)} disabled={saving}>
          삭제
        </AdminLayout.AdminButton>
      </div>
    </div>
  );
}
