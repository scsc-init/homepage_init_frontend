// src/app/executive/user/page.jsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import WithAuthorization from '@/components/WithAuthorization';
import LeadershipPanel from './LeadershipPanel';
import { ReadUserTable } from './UserList';
import EnrollManagementPanel from './EnrollManagementPanel';
import OldboyManageMentPanel from './OldboyManagementPanel';
import {
  getKVValues,
  fetchExecutiveCandidates,
  fetchUsers,
  fetchUserSummaries,
  fetchCurrentUserProfile,
} from '@/util/fetch/server-util';
import { fetchBackendServerJson } from '@/util/fetch/server';
import * as AdminLayout from '@/components/AdminLayout';

export default async function ExecutiveUserPage() {
  const [kv, majors, me] = await Promise.all([
    getKVValues(['main-president', 'vice-president']),
    fetchBackendServerJson('GET', '/api/majors'),
    fetchCurrentUserProfile(),
  ]);

  const viewerRole = me?.role ?? 0;
  const canManageLeadership = viewerRole >= 1000;
  const readUsers = await fetchUserSummaries().catch(() => []);

  const [candidates, executiveUsers] = await Promise.all([
    fetchExecutiveCandidates().catch(() => []),
    fetchUsers().catch(() => []),
  ]);

  const presidentId =
    kv['main-president']?.status === 'fulfilled' ? kv['main-president'].value || '' : '';
  const vicePresidentIds = (
    kv['vice-president']?.status === 'fulfilled' ? kv['vice-president'].value || '' : ''
  ).split(';');

  const initialLeadership = { presidentId, vicePresidentIds };

  const majorsSafe = Array.isArray(majors) ? majors : [];
  const majorsMap = Object.fromEntries(
    majorsSafe.map((m) => [m.id, `${m.college} - ${m.major_name}`]),
  );
  const readUsersSorted = Array.from(
    new Map((Array.isArray(readUsers) ? readUsers : []).map((u) => [u.id, u])),
  )
    .map(([, v]) => v)
    .sort((a, b) => (a?.name || '').localeCompare(b?.name || '', 'ko'))
    .map((u) => ({
      ...u,
      major: majorsMap[u.major_id],
      is_active: Boolean(u?.is_active),
    }));

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
      <AdminLayout.AdminPanel>
        <h2>임원진 구성 관리</h2>
        <p style={{ marginBottom: '1rem', color: '#767676' }}>
          회장과 부회장을 선택한 뒤 저장하면 홈페이지 임원진 목록에 반영됩니다.
        </p>

        <AdminLayout.AdminSection>
          <LeadershipPanel initialLeadership={initialLeadership} candidates={candidates} />
        </AdminLayout.AdminSection>

        <AdminLayout.AdminSection>
          <ReadUserTable users={readUsersSorted} majors={majorsSafe} />
        </AdminLayout.AdminSection>

        {canManageLeadership && (
          <AdminLayout.AdminSection>
            <AdminLayout.AdminLinkButton href="/executive/user/leadership">
              회장단 전용 페이지로 이동
            </AdminLayout.AdminLinkButton>
          </AdminLayout.AdminSection>
        )}

        <AdminLayout.AdminSection>
          <EnrollManagementPanel />
        </AdminLayout.AdminSection>
        <AdminLayout.AdminSection>
          <OldboyManageMentPanel users={executiveUsersSorted} />
        </AdminLayout.AdminSection>
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
