import WithAuthorization from '@/components/WithAuthorization';
import LeadershipPanel from './LeadershipPanel';
import { fetchLeadershipIds, fetchExecutiveCandidates } from '@/util/fetchAPIData';

export default async function LeadershipAdminPage() {
  const [leadershipIds, candidates] = await Promise.all([
    fetchLeadershipIds(),
    fetchExecutiveCandidates(),
  ]);

  const initialLeadership = {
    presidentId: leadershipIds.presidentId ?? '',
    vicePresidentId: leadershipIds.vicePresidentId ?? '',
  };

  return (
    <WithAuthorization>
      <div className="admin-panel">
        <h2>임원진 구성 관리</h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          회장과 부회장을 선택한 뒤 저장하면 홈페이지 임원진 목록에 반영됩니다.
        </p>
        <LeadershipPanel initialLeadership={initialLeadership} candidates={candidates} />
      </div>
    </WithAuthorization>
  );
}
