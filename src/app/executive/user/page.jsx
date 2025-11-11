// src/app/executive/user/page.jsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import WithAuthorization from '@/components/WithAuthorization';
import LeadershipPanel from './LeadershipPanel';
import UserList from './UserList';
import EnrollManagementPanel from './EnrollManagementPanel';
import OldboyManageMentPanel from './OldboyManagementPanel';
import {
  getKVValues,
  fetchExecutiveCandidates,
  fetchUsers,
  fetchMajors,
} from '@/util/fetchAPIData';
import '../page.css';

export default async function ExecutiveUserPage() {
  const [kv, candidates, users, majors] = await Promise.all([
    getKVValues(['main-president', 'vice-president']),
    fetchExecutiveCandidates(),
    fetchUsers(),
    fetchMajors(),
  ]);

  const presidentId =
    kv['main-president']?.status === 'fulfilled' ? kv['main-president'].value || '' : '';
  const vicePresidentId =
    kv['vice-president']?.status === 'fulfilled' ? kv['vice-president'].value || '' : '';

  const initialLeadership = { presidentId, vicePresidentId };

  const usersSorted = Array.from(
    new Map((Array.isArray(users) ? users : []).map((u) => [u.id, u])),
  )
    .map(([, v]) => v)
    .sort((a, b) => (a?.name || '').localeCompare(b?.name || '', 'ko'));
  const majorsSafe = Array.isArray(majors) ? majors : [];

  return (
    <WithAuthorization>
      <div className="admin-panel">
        <h2>임원진 구성 관리</h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          회장과 부회장을 선택한 뒤 저장하면 홈페이지 임원진 목록에 반영됩니다.
        </p>

        <div className="adm-section">
          <LeadershipPanel initialLeadership={initialLeadership} candidates={candidates} />
        </div>

        <details open className="adm-section">
          <summary className="adm-flex" style={{ cursor: 'pointer', fontWeight: 700 }}>
            유저 목록 접기/펼치기
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
