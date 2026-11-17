'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ExecutiveUserTable } from './ExecutiveUserTable';
import * as AdminLayout from '@/app/executive/AdminLayout';

export default function LeadershipClient({ users, majors }) {
  const t = useTranslations('Executive');
  const [debugMessage, setDebugMessage] = useState('');

  const handleShowDetail = (user) => {
    try {
      setDebugMessage(JSON.stringify(user, null, 2));
    } catch (_err) {
      setDebugMessage(t('userOutputFailed'));
    }
  };

  return (
    <div>
      <ExecutiveUserTable users={users} majors={majors} onShowDetail={handleShowDetail} />
      <div style={{ marginTop: '1rem' }}>
        <label
          htmlFor="leadership-debug-console"
          style={{ display: 'block', marginBottom: '0.5rem' }}
        >
          {t('debugConsole')}
        </label>
        <AdminLayout.AdminTextarea
          id="leadership-debug-console"
          style={{
            width: '100%',
            minHeight: '180px',
            fontFamily: 'monospace',
            resize: 'vertical',
          }}
          readOnly
          value={debugMessage}
          placeholder={t('debugPlaceholder')}
        />
      </div>
    </div>
  );
}
