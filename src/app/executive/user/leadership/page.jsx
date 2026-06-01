export const dynamic = 'force-dynamic';
export const revalidate = 0;

import WithAuthorization from '@/components/WithAuthorization';
import LeadershipClient from './LeadershipClient';
import LeadershipAuthorization from './LeadershipAuthorization';
import { fetchUsers } from '@/util/fetch/server-util';
import { fetchBackendServerJson } from '@/util/fetch/server';
import * as AdminLayout from '@/components/AdminLayout';

export default async function ExecutiveLeadershipPage() {
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
          <h2>회장단 전용 관리</h2>
          <p style={{ marginBottom: '1rem', color: '#767676' }}>
            회장단만 접근할 수 있으며 CSV 다운로드와 사용자 관리 기능을 제공합니다.
          </p>
          <AdminLayout.AdminSection>
            <LeadershipClient users={executiveUsersSorted} majors={majorsSafe} />
          </AdminLayout.AdminSection>
        </AdminLayout.AdminPanel>
      </LeadershipAuthorization>
    </WithAuthorization>
  );
}
