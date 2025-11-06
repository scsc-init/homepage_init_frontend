import WithAuthorization from '@/components/WithAuthorization';
import LeadershipPanel from './LeadershipPanel';
import { getKVValues, fetchExecutiveCandidates } from '@/util/fetchAPIData';

export default async function LeadershipAdminPage() {
  const [kv, candidates] = await Promise.all([
    getKVValues(['main-president', 'vice-president']),
    fetchExecutiveCandidates(),
  ]);

  const presidentId =
    kv['main-president']?.status === 'fulfilled' ? kv['main-president'].value || '' : '';
  const vicePresidentId =
    kv['vice-president']?.status === 'fulfilled' ? kv['vice-president'].value || '' : '';

  const initialLeadership = {
    presidentId,
    vicePresidentId,
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
