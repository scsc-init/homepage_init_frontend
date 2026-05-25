// src/app/executive/user/ExportUsersButton.jsx (CLIENT)
'use client';
import * as AdminLayout from '@/components/AdminLayout';

function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';

  let normalized = value;
  if (typeof normalized === 'object') {
    normalized = JSON.stringify(normalized);
  } else {
    normalized = String(normalized);
  }

  if (/^[=+\-@]/.test(normalized)) {
    normalized = `'${normalized}`;
  }

  let safe = normalized.replace(/"/g, '""');
  if (/[",\n]/.test(safe)) {
    safe = `"${safe}"`;
  }
  return safe;
}

function collectHeaders(list) {
  const headerSet = new Set();
  list.forEach((entry) => {
    if (!entry || typeof entry !== 'object') return;
    Object.keys(entry).forEach((key) => headerSet.add(key));
  });
  return [...headerSet];
}

function convertToCsvRows(list) {
  if (!Array.isArray(list) || list.length === 0) return [];

  const headers = collectHeaders(list);
  return [
    headers.join(','),
    ...list.map((entry) => headers.map((key) => escapeCsvValue(entry?.[key])).join(',')),
  ];
}

function downloadCsv(rows, fileName) {
  if (!rows.length) return;
  const csvContent = '\uFEFF' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ExportUsersButton({ allUsers = [], filteredUsers = [] }) {
  const exportData = (getSource, filename) => {
    const source = typeof getSource === 'function' ? getSource() : [];
    const rows = convertToCsvRows(source);
    downloadCsv(rows, filename);
  };

  const handleExportAll = () => exportData(() => allUsers, 'all_users.csv');
  const handleExportFiltered = () => exportData(() => filteredUsers, 'filtered_users.csv');
  const handleExportRegistered = () =>
    exportData(
      () => allUsers.filter((user) => Boolean(user?.is_active)),
      'registered_users.csv',
    );

  return (
    <AdminLayout.AdminActions style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <AdminLayout.AdminButton onClick={handleExportAll} type="button">
        회원 목록 전체 저장
      </AdminLayout.AdminButton>
      <AdminLayout.AdminButton onClick={handleExportFiltered} type="button">
        필터된 회원만 저장
      </AdminLayout.AdminButton>
      <AdminLayout.AdminButton onClick={handleExportRegistered} type="button">
        등록된 회원만 저장
      </AdminLayout.AdminButton>
    </AdminLayout.AdminActions>
  );
}
