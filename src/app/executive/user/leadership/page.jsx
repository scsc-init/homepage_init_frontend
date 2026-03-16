export const dynamic = 'force-dynamic';
export const revalidate = 0;

import WithAuthorization from '@/components/WithAuthorization';
import LeadershipClient from './LeadershipClient';
import { fetchUsers, fetchMajors, fetchMe } from '@/util/fetchAPIData';
import { notFound } from 'next/navigation';
import '../../page.css';

export default async function ExecutiveLeadershipPage() {
  const [majors, executiveUsers, me] = await Promise.all([
    fetchMajors().catch(() => []),
    fetchUsers().catch(() => []),
    fetchMe().catch(() => null),
  ]);

  const viewerRole = me?.role ?? 0;
  if (viewerRole < 1000) {
    notFound();
  }
  const canManageLeadership = viewerRole >= 1000;

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
      <div className="admin-panel">
        <h2>회장단 전용 관리</h2>
        <p style={{ marginBottom: '1rem', color: '#767676' }}>
          회장단만 접근할 수 있으며, CSV 다운로드와 사용자 관리 기능을 제공합니다.
        </p>
        {canManageLeadership ? (
          <div className="adm-section">
            <LeadershipClient users={executiveUsersSorted} majors={majorsSafe} />
          </div>
        ) : (
          <div className="adm-section">
            <p>회장단의 권한이 필요합니다.</p>
          </div>
        )}
      </div>
    </WithAuthorization>
  );
}
