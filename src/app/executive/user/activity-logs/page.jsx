import { getTranslations } from 'next-intl/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import WithAuthorization from '@/components/WithAuthorization';
import * as AdminLayout from '@/app/executive/AdminLayout';
import ActivityLogList from './ActivityLogList';
import { fetchUserSummaries } from '@/util/fetch/server-util';

export default async function UserActivityLogsPage() {
  const t = await getTranslations('Executive');
  const users = await fetchUserSummaries().catch(() => []);

  return (
    <WithAuthorization>
      <AdminLayout.AdminPanel>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ margin: 0 }}>{t('activityLogs')}</h2>
          <Link href="/executive/user">{t('backToUsers')}</Link>
        </div>

        <p style={{ marginBottom: '1rem', color: '#767676' }}>{t('activityLogsHelp')}</p>

        <AdminLayout.AdminSection>
          <ActivityLogList users={users} />
        </AdminLayout.AdminSection>
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
