// src/app/executive/user/page.jsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import WithAuthorization from '@/components/WithAuthorization';
import LeadershipPanel from './LeadershipPanel';
import { ReadUserTable, ExecutiveUserTable } from './UserList';
import EnrollManagementPanel from './EnrollManagementPanel';
import OldboyManageMentPanel from './OldboyManagementPanel';
import {
  getKVValues,
  fetchExecutiveCandidates,
  fetchUsers,
  fetchUserSummaries,
  fetchMajors,
  fetchMe,
} from '@/util/fetchAPIData';
import '../page.css';

export default async function ExecutiveUserPage() {
  const [kv, majors, me] = await Promise.all([
    getKVValues(['main-president', 'vice-president']),
    fetchMajors(),
    fetchMe().catch(() => null),
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
  const readUsersSorted = Array.from(new Map((readUsers ?? []).map((u) => [u.id, u])))
    .map(([, v]) => v)
    .sort((a, b) => (a?.name || '').localeCompare(b?.name || '', 'ko'))
    .map((u) => ({
      ...u,
      major: majorsMap[u.major_id],
      deposit_confirmed: Boolean(u?.deposit_confirmed ?? u?.is_active),
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
      <div className="admin-panel">
        {canManageLeadership && (
          <>
            <h2>임원진 구성 관리</h2>
            <p style={{ marginBottom: '1rem', color: '#767676' }}>
              회장과 부회장을 선택한 뒤 저장하면 홈페이지 임원진 목록에 반영됩니다.
            </p>

            <div className="adm-section">
              <LeadershipPanel initialLeadership={initialLeadership} candidates={candidates} />
            </div>
          </>
        )}

        <div className="adm-section">
          <ReadUserTable users={readUsersSorted} majors={majorsSafe} />
        </div>

        {canManageLeadership && (
          <div className="adm-section">
            <ExecutiveUserTable users={executiveUsersSorted} majors={majorsSafe} />
          </div>
        )}

        <div className="adm-section">
          <EnrollManagementPanel />
        </div>
        <div className="adm-section">
          <OldboyManageMentPanel users={executiveUsersSorted} />
        </div>
      </div>
    </WithAuthorization>
  );
}
