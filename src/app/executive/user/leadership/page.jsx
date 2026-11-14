import { getTranslations } from 'next-intl/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import WithAuthorization from '@/components/WithAuthorization';
import LeadershipClient from './LeadershipClient';
import LeadershipAuthorization from './LeadershipAuthorization';
import DatabaseBackupPanel from './DatabaseBackupPanel';
import { fetchUsers } from '@/util/fetch/server-util';
import { fetchBackendServerJson } from '@/util/fetch/server';
import * as AdminLayout from '@/app/executive/AdminLayout';

export default async function ExecutiveLeadershipPage() {
  const t = await getTranslations('Executive');
  const [majors, executiveUsers] = await Promise.all([
    fetchBackendServerJson('GET', '/api/majors').catch(() => []),
    fetchUsers().catch(() => []),
  ]);

  const majorsSafe = Array.isArray(majors) ? majors : [];
  const majorsMap = Object.fromEntries(
    majorsSafe.map((m) => [m.id, `${m.college} - ${m.major_name}`]),
  );

  const executiveUsersSorted = Array.from(
    new Map((Array.isArray(executiveUsers) ? executiveUsers : []).map((u) => [u.id, u])),
  )
    .map(([, v]) => v)
    .sort((a, b) => (a?.name || '').localeCompare(b?.name || '', 'ko'))
    .map((u) => ({
      ...u,
      major: majorsMap[u.major_id],
    }));

  return (
    <WithAuthorization>
      <LeadershipAuthorization>
        <AdminLayout.AdminPanel>
          <h2>{t('leadershipManagement')}</h2>
          <p style={{ marginBottom: '1rem', color: '#767676' }}>{t('leadershipHelp')}</p>
          <AdminLayout.AdminSection>
            <LeadershipClient users={executiveUsersSorted} majors={majorsSafe} />
          </AdminLayout.AdminSection>
          <DatabaseBackupPanel />
        </AdminLayout.AdminPanel>
      </LeadershipAuthorization>
    </WithAuthorization>
  );
}
