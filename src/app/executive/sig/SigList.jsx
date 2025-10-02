'use client';
import React, { useState } from 'react';
import { STATUS_MAP, SEMESTER_MAP } from '@/util/constants';
import EntryRow from '@/components/EntryRow.jsx';

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
  });

  const updateSigField = (id, field, value) => {
    setSigs((prev) => prev.map((sig) => (sig.id === id ? { ...sig, [field]: value } : sig)));
    setFilteredSigs((prev) =>
      prev.map((sig) => (sig.id === id ? { ...sig, [field]: value } : sig)),
    );
  };

  const updateFilterCriteria = (field, value) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);
    const lower = (v) => v?.toString().toLowerCase() || '';
    const matches = (sig) =>
      (!newFilter.id || lower(sig.id).includes(lower(newFilter.id))) &&
      (!newFilter.title || lower(sig.title).includes(lower(newFilter.title))) &&
      (!newFilter.description || lower(sig.description).includes(lower(newFilter.description))) &&
      (!newFilter.content || lower(sig.content).includes(lower(newFilter.content))) &&
      (!newFilter.status || sig.status.toString() === newFilter.status.toString()) &&
      (!newFilter.year || lower(sig.year).includes(lower(newFilter.year))) &&
      (!newFilter.semester || lower(sig.semester).toString() === newFilter.semester) &&
      (!newFilter.member || sig.members.map((m) => (m.user.name)).includes(lower(newFilter.member)));
    setFilteredSigs(sigs.filter(matches));
  };

  const handleSave = async (sig) => {
    setSaving((prev) => ({ ...prev, [sig.id]: true }));
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
      }),
    });
    if (res.status === 204) alert('저장 완료');
    else alert('저장 실패: ' + res.status);
    setSaving((prev) => ({ ...prev, [sig.id]: false }));
  };

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/executive/sig/${id}/delete`, {
      method: 'POST',
    });
    if (res.status === 204) setSigs((prev) => prev.filter((s) => s.id !== id));
    else alert('삭제 실패: ' + res.status);
  };

  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead>
            <tr>
              <th className="adm-th">ID</th>
              <th className="adm-th">이름</th>
              <th className="adm-th">설명</th>
              <th className="adm-th">내용</th>
              <th className="adm-th">상태</th>
              <th className="adm-th">연도</th>
              <th className="adm-th">학기</th>
              <th className="adm-th">구성원</th>
              <th className="adm-th">작업</th>
            </tr>
          <tr>
            <td className="adm-td">
              <input
                className="adm-input"
                value={filter.id}
                onChange={(e) => updateFilterCriteria('id', e.target.value)}
              />
            </td>
            <td className="adm-td">
              <input
                className="adm-input"
                value={filter.title}
                onChange={(e) => updateFilterCriteria('title', e.target.value)}
              />
            </td>
            <td className="adm-td">
              <input
                className="adm-input"
                value={filter.description}
                onChange={(e) => updateFilterCriteria('description', e.target.value)}
              />
            </td>
            <td className="adm-td">
              <input
                className="adm-input"
                value={filter.content}
                onChange={(e) => updateFilterCriteria('content', e.target.value)}
              />
            </td>
            <td className="adm-td">
              <select
                className="adm-select"
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
            <td className="adm-td">
              <input
                className="adm-input"
                value={filter.year}
                onChange={(e) => updateFilterCriteria('year', e.target.value)}
              />
            </td>
            <td className="adm-td">
              <select
                className="adm-select"
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
            <td className="adm-td">
              <input
                className="adm-input"
                value={filter.member}
                onChange={(e) => updateFilterCriteria('member', e.target.value)}
              />
            </td>
          </tr>
        </thead>
        <tbody>
          {filteredSigs.map((sig) => (
            <EntryRow
              key={sig.id}
              entry={sig}
              onChange={updateSigField}
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
