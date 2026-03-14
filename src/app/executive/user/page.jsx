// src/app/executive/user/page.jsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import WithAuthorization from '@/components/WithAuthorization';
import Link from 'next/link';
import LeadershipPanel from './LeadershipPanel';
import { ReadUserTable } from './UserList';
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
      <div className="admin-panel">
        <h2>임원진 구성 관리</h2>
        <p style={{ marginBottom: '1rem', color: '#767676' }}>
          회장과 부회장을 선택한 뒤 저장하면 홈페이지 임원진 목록에 반영됩니다.
        </p>

        <div className="adm-section">
          <LeadershipPanel initialLeadership={initialLeadership} candidates={candidates} />
        </div>

        <div className="adm-section">
          <ReadUserTable users={readUsersSorted} majors={majorsSafe} />
        </div>

        {canManageLeadership && (
          <div className="adm-section">
            <p style={{ marginBottom: '0.5rem', color: '#767676' }}>
              회장단 전용 테이블과 CSV 기능은 별도 페이지에서 관리됩니다.
            </p>
            <Link href="/executive/user/leadership" className="adm-button">
              회장단 전용 페이지로 이동
            </Link>
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
