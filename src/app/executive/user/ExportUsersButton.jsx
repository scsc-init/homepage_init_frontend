// src/app/executive/user/ExportUsersButton.jsx (CLIENT)
'use client';

function convertToCsvRows(list) {
  if (!Array.isArray(list) || list.length === 0) return [];
  const headers = Object.keys(list[0]);
  const rows = [
    headers.join(','),
    ...list.map((entry) =>
      headers
        .map((key) => {
          let value = entry?.[key];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') value = JSON.stringify(value);
          if (typeof value === 'string') {
            let safe = value.replace(/"/g, '""');
            if (safe.search(/[",\n]/g) >= 0) safe = `"${safe}"`;
            return safe;
          }
          return value;
        })
        .join(','),
    ),
  ];
  return rows;
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
    <div className="adm-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <button onClick={handleExportAll} className="adm-button" type="button">
        회원 목록 전체 저장
      </button>
      <button onClick={handleExportFiltered} className="adm-button" type="button">
        필터된 회원만 저장
      </button>
      <button onClick={handleExportRegistered} className="adm-button" type="button">
        등록된 회원만 저장
      </button>
    </div>
  );
}
