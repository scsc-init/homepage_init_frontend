import PigListClient from './PigListClient';
import './page.css';
import { fetchBackendServerJson } from '@/util/fetch/server';

export const metadata = { title: 'PIG' };

export default async function PigListPage() {
  const pigs = await fetchBackendServerJson('GET', '/api/sigs', {
    query: { tag: 'PIG' },
  }).then(
    (value) => ({ status: 'fulfilled', value }),
    (reason) => ({ status: 'rejected', reason }),
  );

  if (pigs.status === 'rejected') {
    return <div>피그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['recruiting', 'active']);

  const visiblePigs = (Array.isArray(pigs.value) ? pigs.value : []).filter(
    (p) => p && typeof p === 'object' && allowed.has(p.status),
  );

  return (
    <div id="PigListContainer">
      <PigListClient pigs={visiblePigs} />
    </div>
  );
}
