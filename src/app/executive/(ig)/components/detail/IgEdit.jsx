'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  STATUS_MAP,
  SEMESTER_MAP,
  SIG_ADMISSION_LABEL_MAP,
  PIG_ADMISSION_LABEL_MAP,
} from '@/util/constants';
import SigTagManager from '@/components/board/SigTagManager';
import * as AdminLayout from '@/components/AdminLayout';

const getLeaderUserId = (ig) => {
  if (ig?.owner == null) return '';
  return String(ig.owner);
};

const createWebsiteFormKey = (site, index) =>
  site?.id != null ? `website-${site.id}` : `website-${index}-${site?.url ?? ''}`;

const createNewWebsiteFormKey = () =>
  globalThis.crypto?.randomUUID?.() ?? `website-new-${Date.now()}-${Math.random()}`;

const normalizeWebsitesForForm = (websites = []) => {
  const normalized = (Array.isArray(websites) ? websites : []).map((site, index) => ({
    _key: createWebsiteFormKey(site, index),
    url: site?.url ?? '',
  }));
  return normalized.length > 0 ? normalized : [{ _key: 'website-empty', url: '' }];
};

const sanitizeWebsites = (websites = []) =>
  (Array.isArray(websites) ? websites : [])
    .map((site) => ({ url: site?.url?.trim() ?? '' }))
    .filter((site) => site.url)
    .map((site, index) => ({
      label: site.url,
      url: site.url,
      sort_order: index,
    }));

const renderIgEdit = (ig, ctx) => {
  const igIdStr = String(ig.id);
  const ownerIdStr = ig?.owner != null ? String(ig.owner) : '';
  const members = Array.isArray(ig?.members) ? ig.members : [];
  const leaderId = getLeaderUserId(ig);
  const selected = ctx.selectedMember ?? leaderId;

  return (
    <>
      <tr>
        <td>ID</td>
        <td>{ig.id}</td>
      </tr>

      {renderIgRow(ig, ctx, 'title', '이름')}
      {renderIgRow(ig, ctx, 'description', '설명')}
      {renderIgRow(ig, ctx, 'content', '내용')}

      <tr>
        <td>웹사이트</td>
        <td>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(Array.isArray(ig.websites) ? ig.websites : []).map((website, index) => (
              <AdminLayout.AdminFlex key={website._key}>
                <AdminLayout.AdminInput
                  value={website?.url ?? ''}
                  placeholder="https://example.com"
                  onChange={(e) => ctx.updateWebsiteUrl(index, e.target.value)}
                />
                <button
                  type="button"
                  className="text-sm text-red-500 hover:underline"
                  style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                  onClick={() => ctx.removeWebsite(index)}
                  disabled={ctx.saving}
                >
                  삭제
                </button>
              </AdminLayout.AdminFlex>
            ))}
            <AdminLayout.AdminButton
              type="button"
              onClick={ctx.addWebsite}
              disabled={ctx.saving}
            >
              웹사이트 추가
            </AdminLayout.AdminButton>
          </div>
        </td>
      </tr>

      <tr>
        <td>상태</td>
        <td>
          <AdminLayout.AdminSelect
            value={ig.status ?? ''}
            onChange={(e) => ctx.updateIgField('status', e.target.value)}
          >
            {Object.keys(STATUS_MAP).map((key) => (
              <option key={key} value={key}>
                {STATUS_MAP[key]}
              </option>
            ))}
          </AdminLayout.AdminSelect>
        </td>
      </tr>

      {renderIgRow(ig, ctx, 'year', '연도')}

      <tr>
        <td>학기</td>
        <td>
          <AdminLayout.AdminSelect
            value={ig.semester ?? ''}
            onChange={(e) => ctx.updateIgField('semester', e.target.value)}
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
        <td>{ig.created_year ?? ''}</td>
      </tr>

      <tr>
        <td>최초 생성 학기</td>
        <td>
          {ig.created_semester != null
            ? `${SEMESTER_MAP[Number(ig.created_semester)] ?? ig.created_semester}학기`
            : ''}
        </td>
      </tr>

      <tr>
        <td>연장 신청</td>
        <td>
          <AdminLayout.AdminSelectBool
            value={String(Boolean(ig.should_extend))}
            onChange={(e) => ctx.updateIgField('should_extend', e.target.value === 'true')}
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
            value={ig['is_rolling_admission'] ?? 'during_recruiting'}
            onChange={(e) => ctx.updateIgField('is_rolling_admission', e.target.value)}
          >
            <option value="always">
              {(ctx.is_sig ? SIG_ADMISSION_LABEL_MAP : PIG_ADMISSION_LABEL_MAP).always}
            </option>
            <option value="never">
              {(ctx.is_sig ? SIG_ADMISSION_LABEL_MAP : PIG_ADMISSION_LABEL_MAP).never}
            </option>
            <option value="during_recruiting">
              {
                (ctx.is_sig ? SIG_ADMISSION_LABEL_MAP : PIG_ADMISSION_LABEL_MAP)
                  .during_recruiting
              }
            </option>
          </AdminLayout.AdminSelectBoolWide>
        </td>
      </tr>

      <tr>
        <td>{ctx.is_sig ? 'SIG장' : 'PIG장'}</td>
        <td>
          <AdminLayout.AdminSelect
            value={selected || ''}
            onChange={(e) => ctx.setSelectedMember(e.target.value)}
          >
            {members.length === 0 ? <option value="">(없음)</option> : null}
            {members.map((m, idx) => {
              const mid = m?.user_id != null ? String(m.user_id) : '';
              const name = m?.user?.name ?? '';
              const label =
                mid && mid === ownerIdStr
                  ? `[${ctx.is_sig ? 'SIG장' : 'PIG장'}] ${name}`
                  : name;
              return (
                <option key={`${igIdStr}-${mid || name}-${idx}`} value={mid}>
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

function renderIgRow(ig, ctx, attrName, attrLabel) {
  return (
    <tr>
      <td>{attrLabel}</td>
      <td>
        <AdminLayout.AdminInput
          value={ig[attrName] ?? ''}
          onChange={(e) => ctx.updateIgField(attrName, e.target.value)}
        />
      </td>
    </tr>
  );
}

export default function IgExecutiveEdit({ ig: _ig, is_sig = false, is_pig = false }) {
  const [saving, setSaving] = useState(false);
  const [ig, setIg] = useState({
    ..._ig,
    websites: normalizeWebsitesForForm(_ig?.websites),
  });
  const [selectedMember, setSelectedMember] = useState(getLeaderUserId(_ig));
  const tagManagerRef = useRef(null);
  const router = useRouter();

  if (is_sig === is_pig) {
    console.error('IgExecutiveEdit: is_sig and is_pig must differ');
    return null;
  }

  const igSlug = is_sig ? 'sig' : 'pig';
  const igLabel = igSlug.toUpperCase();

  const handleSave = async () => {
    try {
      setSaving(true);
      const res1 = await fetchBackendClient(`/api/executive/sig/${ig.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ig.title,
          description: ig.description,
          content: ig.content,
          status: ig.status,
          year: ig.year,
          semester: ig.semester,
          should_extend: Boolean(ig.should_extend),
          is_rolling_admission: String(ig.is_rolling_admission),
          websites: sanitizeWebsites(ig.websites),
        }),
      });
      if (!res1.ok) {
        const msg1 = await res1.json();
        alert(`저장 실패. ${igLabel} 정보 수정: ${msg1?.detail ?? res1.status}`);
        setSaving(false);
        return;
      }

      await tagManagerRef.current?.syncTags();

      let res2 = null;
      if (selectedMember !== getLeaderUserId(ig)) {
        res2 = await fetchBackendClient(`/api/executive/sig/${ig.id}/handover`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ new_owner: selectedMember }),
        });
      }
      if (!res2 || res2.ok) alert('저장 완료');
      else {
        const msg2 = res2 ? await res2.json() : undefined;
        alert(`저장 실패. ${igLabel} 변경: ${msg2?.detail ?? res2.status}`);
      }
      router.refresh();
    } catch (err) {
      alert(err.message || '저장 실패: 네트워크 오류');
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
        router.replace(`/executive/${igSlug}`);
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

  const updateIgField = (field, value) => {
    setIg((prev) => ({ ...prev, [field]: value }));
  };

  const updateWebsiteUrl = (index, value) => {
    setIg((prev) => ({
      ...prev,
      websites: (Array.isArray(prev.websites) ? prev.websites : []).map((website, i) =>
        i === index ? { ...website, url: value } : website,
      ),
    }));
  };

  const addWebsite = () => {
    setIg((prev) => ({
      ...prev,
      websites: [
        ...(Array.isArray(prev.websites) ? prev.websites : []),
        { _key: createNewWebsiteFormKey(), url: '' },
      ],
    }));
  };

  const removeWebsite = (index) => {
    setIg((prev) => ({
      ...prev,
      websites: (Array.isArray(prev.websites) ? prev.websites : []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const rowCtx = {
    saving,
    selectedMember,
    setSelectedMember,
    updateIgField,
    updateWebsiteUrl,
    addWebsite,
    removeWebsite,
    handleSave,
    handleDelete,
    is_sig,
  };

  return (
    <div>
      <AdminLayout.AdminTable>
        <colgroup>
          <AdminLayout.AdminColBoolWide></AdminLayout.AdminColBoolWide>
        </colgroup>
        <thead>
          <tr>
            <th>속성</th>
            <th>값</th>
          </tr>
        </thead>
        <tbody>{renderIgEdit(ig, rowCtx)}</tbody>
      </AdminLayout.AdminTable>
      {is_sig ? (
        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <SigTagManager
            ref={tagManagerRef}
            sigId={ig.id}
            initialTags={_ig?.tags}
            isExecutive
            disabled={saving}
          />
        </div>
      ) : null}
      <div>
        <AdminLayout.AdminButton onClick={handleSave} disabled={saving}>
          저장
        </AdminLayout.AdminButton>
        <AdminLayout.AdminButton onClick={() => handleDelete(ig.id)} disabled={saving}>
          삭제
        </AdminLayout.AdminButton>
      </div>
    </div>
  );
}
