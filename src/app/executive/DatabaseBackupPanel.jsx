'use client';

import { useState } from 'react';
import * as AdminLayout from '@/components/AdminLayout';
import { useMe } from '@/util/hooks/useMe';
import { fetchBackendClient } from '@/util/fetch/client';

const PRESIDENT_ROLE_LEVEL = 1000;

function getDownloadFilename(contentDisposition) {
  if (!contentDisposition) return 'db_backup.sql';

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const plainMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  return plainMatch?.[1] || 'db_backup.sql';
}

function triggerDownload(blob, filename) {
  const blobUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export default function DatabaseBackupPanel() {
  const { me, isLoading } = useMe();
  const [downloading, setDownloading] = useState(false);

  if (isLoading) return null;
  if (!me || (me.role ?? 0) < PRESIDENT_ROLE_LEVEL) return null;

  const handleBackup = async () => {
    setDownloading(true);

    try {
      const res = await fetchBackendClient('/api/executive/scsc/global/status/backup', {
        method: 'POST',
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (res.status === 403) {
          alert('회장 권한이 필요합니다.');
        } else {
          alert(`DB 백업 실패: ${errorText || res.status}`);
        }
        return;
      }

      const blob = await res.blob();
      const filename = getDownloadFilename(res.headers.get('Content-Disposition'));
      triggerDownload(blob, filename);
      alert('DB 백업 파일 다운로드를 시작했습니다.');
    } catch (error) {
      alert(`DB 백업 요청 실패: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AdminLayout.AdminSection>
      <h3>DB 백업</h3>
      <p style={{ marginBottom: '0.75rem' }}>
        현재 PostgreSQL DB를 백업하고 SQL 파일을 다운로드합니다.
      </p>
      <AdminLayout.AdminButtonDanger onClick={handleBackup} disabled={downloading}>
        {downloading ? '백업 중...' : 'DB 백업 다운로드'}
      </AdminLayout.AdminButtonDanger>
    </AdminLayout.AdminSection>
  );
}
