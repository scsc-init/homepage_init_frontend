'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';
import * as AdminLayout from '@/app/executive/AdminLayout';

const lower = (value) => value?.toString().toLowerCase() || '';

function IgFilterRow({ filter, updateFilterCriteria }) {
  const t = useTranslations('Executive');
  const statusLabels = t.raw('statuses');
  const semesterLabels = t.raw('semesters');
  return (
    <tr>
      <td>
        <AdminLayout.AdminInput
          value={filter.title}
          onChange={(e) => updateFilterCriteria('title', e.target.value)}
        />
      </td>
      <td>
        <AdminLayout.AdminSelect
          value={filter.status}
          onChange={(e) => updateFilterCriteria('status', e.target.value)}
        >
          <option value="">{t('allStatuses')}</option>
          {Object.keys(STATUS_MAP).map((key) => (
            <option key={key} value={key}>
              {statusLabels[key]}
            </option>
          ))}
        </AdminLayout.AdminSelect>
      </td>
      <td>
        <AdminLayout.AdminInput
          value={filter.year}
          onChange={(e) => updateFilterCriteria('year', e.target.value)}
        />
      </td>
      <td>
        <AdminLayout.AdminSelect
          value={filter.semester}
          onChange={(e) => updateFilterCriteria('semester', e.target.value)}
        >
          <option value="">{t('allSemesters')}</option>
          {Object.keys(SEMESTER_MAP).map((key) => (
            <option key={key} value={key}>
              {t('semesterLabel', { value0: semesterLabels[key] ?? '' })}
            </option>
          ))}
        </AdminLayout.AdminSelect>
      </td>
      <td>
        <AdminLayout.AdminInput
          value={filter.ownerName}
          onChange={(e) => updateFilterCriteria('ownerName', e.target.value)}
        />
      </td>
      <td />
    </tr>
  );
}

function IgRow({ ig, igSlug }) {
  const t = useTranslations('Executive');
  const statusLabels = t.raw('statuses');
  const semesterLabels = t.raw('semesters');
  return (
    <tr>
      <td>{ig.title ?? ''}</td>
      <td>{statusLabels[ig.status] ?? ''}</td>
      <td>{ig.year ?? ''}</td>
      <td>{t('semesterLabel', { value0: semesterLabels[Number(ig.semester)] ?? '' ?? '' })}</td>
      <td>{ig.ownerName ?? ''}</td>
      <td>
        <a href={`/executive/${igSlug}/${ig.id}`} data-underline>
          {t('viewDetail')}
        </a>
      </td>
    </tr>
  );
}

export default function IgList({ igs, igType }) {
  const t = useTranslations('Executive');
  const [filter, setFilter] = useState({
    title: '',
    status: '',
    year: '',
    semester: '',
    ownerName: '',
  });

  const igLabel = t.raw('groupLabels')[igType];

  const filteredIgs = useMemo(() => {
    const safeIgs = Array.isArray(igs) ? igs : [];

    const matches = (ig) =>
      (!filter.title || lower(ig.title).includes(lower(filter.title))) &&
      (!filter.status || ig.status?.toString() === filter.status.toString()) &&
      (!filter.year || lower(ig.year).includes(lower(filter.year))) &&
      (!filter.semester || ig.semester?.toString() === filter.semester) &&
      (!filter.ownerName || lower(ig.ownerName).includes(lower(filter.ownerName)));

    return safeIgs.filter(matches);
  }, [igs, filter]);

  return (
    <AdminLayout.AdminTableWrap>
      <AdminLayout.AdminTable>
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('status')}</th>
            <th>{t('year')}</th>
            <th>{t('semester')}</th>
            <th>{t('groupLeader', { value0: String(igLabel) })}</th>
            <th>{t('viewDetail')}</th>
          </tr>
          <IgFilterRow
            filter={filter}
            updateFilterCriteria={(field, value) =>
              setFilter((prev) => ({ ...prev, [field]: value }))
            }
          />
        </thead>
        <tbody>
          {filteredIgs.map((ig) => (
            <IgRow key={ig.id} ig={ig} igSlug={igType} />
          ))}
        </tbody>
      </AdminLayout.AdminTable>
    </AdminLayout.AdminTableWrap>
  );
}
