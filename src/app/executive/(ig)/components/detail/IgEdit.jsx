'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';
import SigTagManager from '@/app/(ig)/components/editor/SigTagManager';
import * as AdminLayout from '@/app/executive/AdminLayout';

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
  const { t } = ctx;
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

      {renderIgRow(ig, ctx, 'title', t('name'))}
      {renderIgRow(ig, ctx, 'description', t('description'))}
      {renderIgRow(ig, ctx, 'content', t('content'))}

      <tr>
        <td>{t('website')}</td>
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
                  {t('delete')}
                </button>
              </AdminLayout.AdminFlex>
            ))}
            <AdminLayout.AdminButton
              type="button"
              onClick={ctx.addWebsite}
              disabled={ctx.saving}
            >
              {t('addWebsite')}
            </AdminLayout.AdminButton>
          </div>
        </td>
      </tr>

      <tr>
        <td>{t('status')}</td>
        <td>
          <AdminLayout.AdminSelect
            value={ig.status ?? ''}
            onChange={(e) => ctx.updateIgField('status', e.target.value)}
          >
            {Object.keys(STATUS_MAP).map((key) => (
              <option key={key} value={key}>
                {t.raw('statuses')[key]}
              </option>
            ))}
          </AdminLayout.AdminSelect>
        </td>
      </tr>

      {renderIgRow(ig, ctx, 'year', t('year'))}

      <tr>
        <td>{t('semester')}</td>
        <td>
          <AdminLayout.AdminSelect
            value={ig.semester ?? ''}
            onChange={(e) => ctx.updateIgField('semester', e.target.value)}
          >
            {Object.keys(SEMESTER_MAP).map((key) => (
              <option key={key} value={key}>
                {t('semesterLabel', { value0: t.raw('semesters')[key] ?? '' })}
              </option>
            ))}
          </AdminLayout.AdminSelect>
        </td>
      </tr>

      <tr>
        <td>{t('creationYear')}</td>
        <td>{ig.created_year ?? ''}</td>
      </tr>

      <tr>
        <td>{t('creationSemester')}</td>
        <td>
          {ig.created_semester != null
            ? t('semesterLabel', {
                value0:
                  t.raw('semesters')[Number(ig.created_semester)] ?? ig.created_semester ?? '',
              })
            : ''}
        </td>
      </tr>

      <tr>
        <td>{t('extensionRequested')}</td>
        <td>
          <AdminLayout.AdminSelectBool
            value={String(Boolean(ig.should_extend))}
            onChange={(e) => ctx.updateIgField('should_extend', e.target.value === 'true')}
          >
            <option value="true">{t('yes')}</option>
            <option value="false">{t('no')}</option>
          </AdminLayout.AdminSelectBool>
        </td>
      </tr>

      <tr>
        <td>{t('admissionPeriod')}</td>
        <td>
          <AdminLayout.AdminSelectBoolWide
            value={ig['is_rolling_admission'] ?? 'during_recruiting'}
            onChange={(e) => ctx.updateIgField('is_rolling_admission', e.target.value)}
          >
            <option value="always">{t('admissionAlways')}</option>
            <option value="never">{t('admissionNever')}</option>
            <option value="during_recruiting">
              {t('admissionDuringRecruiting', { group: ctx.igLabel ?? '' })}
            </option>
          </AdminLayout.AdminSelectBoolWide>
        </td>
      </tr>

      <tr>
        <td>{t('groupLeader', { value0: String(ctx.igLabel) })}</td>
        <td>
          <AdminLayout.AdminSelect
            value={selected || ''}
            onChange={(e) => ctx.setSelectedMember(e.target.value)}
          >
            {members.length === 0 ? <option value="">{t('none')}</option> : null}
            {members.map((m, idx) => {
              const mid = m?.user_id != null ? String(m.user_id) : '';
              const name = m?.user?.name ?? '';
              const label =
                mid && mid === ownerIdStr
                  ? t('groupLeaderName', { value0: String(ctx.igLabel), value1: String(name) })
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

export default function IgExecutiveEdit({ ig: _ig, igType }) {
  const t = useTranslations('Executive');
  const [saving, setSaving] = useState(false);
  const [ig, setIg] = useState({
    ..._ig,
    websites: normalizeWebsitesForForm(_ig?.websites),
  });
  const [selectedMember, setSelectedMember] = useState(getLeaderUserId(_ig));
  const tagManagerRef = useRef(null);
  const router = useRouter();

  const isSig = igType === 'sig';
  const isSmallGroup = igType === 'small-group';
  const canEditTags = isSig || isSmallGroup;
  const igLabel = t.raw('groupLabels')[igType];

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
        alert(
          t('groupSaveFailed', {
            value0: String(igLabel),
            value1: String(msg1?.detail ?? res1.status),
          }),
        );
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
      if (!res2 || res2.ok) alert(t('saved'));
      else {
        const msg2 = res2 ? await res2.json() : undefined;
        alert(
          t('groupChangeFailed', {
            value0: String(igLabel),
            value1: String(msg2?.detail ?? res2.status),
          }),
        );
      }
      router.refresh();
    } catch (err) {
      alert(err.message || t('saveNetworkError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('confirmDelete'))) return;
    try {
      setSaving(true);
      const res = await fetchBackendClient(`/api/executive/sig/${id}/delete`, {
        method: 'POST',
      });
      if (res.status === 204) {
        router.replace(`/executive/${igType}`);
      } else {
        const msg = await res.json();
        alert(t('deleteFailedPrefix') + (msg.detail ?? res.status));
      }
    } catch {
      alert(t('deleteNetworkError'));
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
    t,
    saving,
    selectedMember,
    setSelectedMember,
    updateIgField,
    updateWebsiteUrl,
    addWebsite,
    removeWebsite,
    handleSave,
    handleDelete,
    igLabel,
  };

  return (
    <div>
      <AdminLayout.AdminTable>
        <colgroup>
          <AdminLayout.AdminColBoolWide></AdminLayout.AdminColBoolWide>
        </colgroup>
        <thead>
          <tr>
            <th>{t('attribute')}</th>
            <th>{t('value')}</th>
          </tr>
        </thead>
        <tbody>{renderIgEdit(ig, rowCtx)}</tbody>
      </AdminLayout.AdminTable>
      {canEditTags ? (
        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <SigTagManager
            translate={t}
            ref={tagManagerRef}
            targetLabel={igLabel}
            sigId={ig.id}
            initialTags={_ig?.tags}
            isExecutive
            disabled={saving}
          />
        </div>
      ) : null}
      <div>
        <AdminLayout.AdminButton onClick={handleSave} disabled={saving}>
          {t('save')}
        </AdminLayout.AdminButton>
        <AdminLayout.AdminButton onClick={() => handleDelete(ig.id)} disabled={saving}>
          {t('delete')}
        </AdminLayout.AdminButton>
      </div>
    </div>
  );
}
