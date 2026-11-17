'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as AdminLayout from '@/app/executive/AdminLayout';
import { useMe } from '@/util/hooks/useMe';
import { fetchBackendClient } from '@/util/fetch/client';

const PRESIDENT_ROLE_LEVEL = 1000;

function getDownloadFilename(contentDisposition) {
  if (!contentDisposition) return 'db_backup.tar.gz';

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const plainMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  return plainMatch?.[1] || 'db_backup.tar.gz';
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
  const t = useTranslations('Executive');
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
          alert(t('presidentPermissionRequired'));
        } else {
          alert(t('backupFailed', { value0: String(errorText || res.status) }));
        }
        return;
      }

      const blob = await res.blob();
      const filename = getDownloadFilename(res.headers.get('Content-Disposition'));
      triggerDownload(blob, filename);
      alert(t('backupStarted'));
    } catch (error) {
      alert(
        t('backupRequestFailed', {
          value0: String(error instanceof Error ? error.message : String(error)),
        }),
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AdminLayout.AdminSection>
      <h3>{t('backup')}</h3>
      <p style={{ marginBottom: '0.75rem' }}>{t('backupDescription')}</p>
      <AdminLayout.AdminButtonDanger onClick={handleBackup} disabled={downloading}>
        {downloading ? t('backingUp') : t('downloadBackup')}
      </AdminLayout.AdminButtonDanger>
    </AdminLayout.AdminSection>
  );
}
