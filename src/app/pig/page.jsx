import PigListClient from './PigListClient';
import './page.css';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchCurrentUserProfile } from '@/util/fetch/server-util';

export const metadata = { title: 'PIG' };

export default async function PigListPage() {
  const [pigs, me] = await Promise.allSettled([
    fetchBackendServerJson('GET', '/api/pigs'),
    fetchCurrentUserProfile(),
  ]);

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
