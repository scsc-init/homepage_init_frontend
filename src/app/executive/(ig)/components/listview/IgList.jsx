'use client';

import { useMemo, useState } from 'react';
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';
import * as AdminLayout from '@/components/AdminLayout';

const lower = (value) => value?.toString().toLowerCase() || '';

function IgFilterRow({ filter, updateFilterCriteria }) {
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
          <option value="">상태 전체</option>
          {Object.keys(STATUS_MAP).map((key) => (
            <option key={key} value={key}>
              {STATUS_MAP[key]}
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
          <option value="">학기 전체</option>
          {Object.keys(SEMESTER_MAP).map((key) => (
            <option key={key} value={key}>
              {SEMESTER_MAP[key]}학기
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
  return (
    <tr>
      <td>{ig.title ?? ''}</td>
      <td>{STATUS_MAP[ig.status] ?? ''}</td>
      <td>{ig.year ?? ''}</td>
      <td>{SEMESTER_MAP[Number(ig.semester)] ?? ''}학기</td>
      <td>{ig.ownerName ?? ''}</td>
      <td>
        <a href={`/executive/${igSlug}/${ig.id}`} data-underline>
          상세보기
        </a>
      </td>
    </tr>
  );
}

export default function IgList({ igs, igType }) {
  const [filter, setFilter] = useState({
    title: '',
    status: '',
    year: '',
    semester: '',
    ownerName: '',
  });

  const igSlug = igType.toLowerCase();

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
            <th>이름</th>
            <th>상태</th>
            <th>연도</th>
            <th>학기</th>
            <th>{igType}장</th>
            <th>상세보기</th>
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
            <IgRow key={ig.id} ig={ig} igSlug={igSlug} />
          ))}
        </tbody>
      </AdminLayout.AdminTable>
    </AdminLayout.AdminTableWrap>
  );
}
