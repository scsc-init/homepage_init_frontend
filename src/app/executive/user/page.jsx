// src/app/executive/user/page.jsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import WithAuthorization from '@/components/WithAuthorization';
import LeadershipPanel from './LeadershipPanel';
import UserList from './UserList';
import EnrollManagementPanel from './EnrollManagementPanel';
import OldboyManageMentPanel from './OldboyManagementPanel';
import EnrollmentPolicyPanel from './EnrollmentPolicyPanel';
import {
  getKVValues,
  fetchExecutiveCandidates,
  fetchUsers,
  fetchMajors,
  fetchSCSCGlobalStatus,
} from '@/util/fetchAPIData';
import '../page.css';

export default async function ExecutiveUserPage() {
  const [kv, candidates, users, majors, scscGlobalStatus] = await Promise.all([
    getKVValues(['main-president', 'vice-president']),
    fetchExecutiveCandidates(),
    fetchUsers(),
    fetchMajors(),
    fetchSCSCGlobalStatus(),
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
  const usersSorted = Array.from(
    new Map((Array.isArray(users) ? users : []).map((u) => [u.id, u])),
  )
    .map(([, v]) => v)
    .sort((a, b) => (a?.name || '').localeCompare(b?.name || '', 'ko'))
    .map((u) => ({ ...u, major: majorsMap[u.major_id] }));

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

        <h2>등록 정책 관리</h2>
        <p style={{ marginBottom: '1rem', color: '#767676' }}>
          등록 부여할 학기 수가 로딩되는 동안 0으로 표시됩니다.
        </p>
        <div className="adm-section">
          <EnrollmentPolicyPanel scscGlobalStatus={scscGlobalStatus} />
        </div>

        <details open className="adm-section">
          <summary className="adm-flex" style={{ cursor: 'pointer', fontWeight: 700 }}>
            <h2>유저 목록 접기/펼치기</h2>
          </summary>
          <div className="adm-section" style={{ marginTop: '0.75rem' }}>
            <UserList users={usersSorted} majors={majorsSafe} />
          </div>
        </details>

        <div className="adm-section">
          <EnrollManagementPanel />
        </div>
        <div className="adm-section">
          <OldboyManageMentPanel users={usersSorted} />
        </div>
      </div>
    </WithAuthorization>
  );
}
