import PigListClient from './PigListClient';
import './page.css';
import { safeServerFetch, fetchMe } from '@/util/fetchAPIData';

export const metadata = { title: 'PIG' };

export default async function PigListPage() {
  const [pigs, me] = await Promise.allSettled([safeServerFetch('GET', '/api/pigs'), fetchMe()]);

  if (pigs.status === 'rejected') {
    return <div>피그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['recruiting', 'active']);

  const visiblePigs = (Array.isArray(pigs.value) ? pigs.value : []).filter(
    (p) => p && typeof p === 'object' && allowed.has(p.status),
  );

  let myId = '';
  if (me.status === 'fulfilled' && me.value?.id != null) {
    myId = String(me.value.id);
  }

  return (
    <div id="PigListContainer">
      <PigListClient pigs={visiblePigs} myId={myId} />
    </div>
  );
}
