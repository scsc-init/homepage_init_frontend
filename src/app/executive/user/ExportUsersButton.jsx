'use client'

const ExportUsersButton = ({ filteredUsers }) => {
  const handleExportCSV = () => {
    if (!filteredUsers || filteredUsers.length === 0) return;

    const headers = Object.keys(filteredUsers[0]);
    const csvRows = [
      headers.join(','),
      ...filteredUsers.map(user =>
        headers.map(key => {
          let value = user[key];

          if (typeof value === 'string') {
            value = value.replace(/"/g, '""');
            if (value.search(/("|,|\n)/g) >= 0) {
              value = `"${value}"`;
            }
          }

          return value;
        }).join(',')
      )
    ];

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'filtered_users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExportCSV}
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
    >
      Export to CSV
    </button>
  );
};

export default ExportUsersButton;
