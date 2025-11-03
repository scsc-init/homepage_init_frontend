import PigListClient from './PigListClient';
import './page.css';
import { fetchPigs, fetchMe } from '@/util/fetchAPIData';

export const metadata = { title: 'PIG' };

export default async function PigListPage() {
  const [pigs, me] = await Promise.allSettled([fetchPigs(), fetchMe()]);

  if (pigs.status === 'rejected') {
    return <div>피그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['surveying', 'recruiting', 'active']);
  const visiblePigs = pigs.value
    .filter((p) => p.status === 'fulfilled')
    .map((p) => p.value)
    .filter((p) => allowed.has(p.status));

  let myId = '';
  if (me.status === 'fulfilled') {
    myId = me.value.id;
  }

  return (
    <div id="PigListContainer">
      <PigListClient pigs={visiblePigs} myId={myId} />
    </div>
  );
}
