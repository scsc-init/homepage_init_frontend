'use client';

import { useMemo, useState } from 'react';
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';
import * as AdminLayout from '@/components/AdminLayout';

function SigFilterRow({ filter, updateFilterCriteria }) {
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
      <td></td>
    </tr>
  );
}

const RenderSigRow = ({ sig }) => {
  return (
    <tr>
      <td>{sig.title ?? ''}</td>
      <td>{STATUS_MAP[sig.status] ?? ''}</td>
      <td>{sig.year ?? ''}</td>
      <td>{SEMESTER_MAP[Number(sig.semester)] ?? ''}학기</td>
      <td>{sig.ownerName ?? ''}</td>
      <td>
        <a href={`/executive/sig/${sig.id}`} data-underline>
          상세보기
        </a>
      </td>
    </tr>
  );
};

const lower = (v) => v?.toString().toLowerCase() || '';

export default function SigList({ sigs }) {
  const [filter, setFilter] = useState({
    title: '',
    status: '',
    year: '',
    semester: '',
    ownerName: '',
  });

  const filteredSigs = useMemo(() => {
    const matches = (sig) =>
      (!filter.title || lower(sig.title).includes(lower(filter.title))) &&
      (!filter.status || sig.status?.toString() === filter.status.toString()) &&
      (!filter.year || lower(sig.year).includes(lower(filter.year))) &&
      (!filter.semester || lower(sig.semester).toString() === filter.semester) &&
      (!filter.ownerName || lower(sig.ownerName).includes(lower(filter.ownerName)));
    return sigs.filter(matches);
  }, [sigs, filter]);

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
            <th>SIG장</th>
            <th>상세보기</th>
          </tr>
          <SigFilterRow
            filter={filter}
            updateFilterCriteria={(field, value) => setFilter({ ...filter, [field]: value })}
          />
        </thead>
        <tbody>
          {filteredSigs.map((sig) => (
            <RenderSigRow sig={sig} key={sig.id} />
          ))}
        </tbody>
      </AdminLayout.AdminTable>
    </AdminLayout.AdminTableWrap>
  );
}
