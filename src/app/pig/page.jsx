import PigListClient from './PigListClient';
import './page.css';
import { fetchPigs, fetchUser } from '@/util/fetchAPIData';

export const metadata = { title: 'PIG' };

export default async function PigListPage() {
  const pigs = await fetchPigs();
  const me = await fetchUser();

  if (!Array.isArray(pigs)) {
    return <div>피그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['surveying', 'recruiting', 'active']);
  const visiblePigs = pigs.filter((s) => allowed.has(s.status));

  return (
    <div id="PigListContainer">
      <PigListClient pigs={visiblePigs} myId={me?.id ? String(me.id) : ''} />
    </div>
  );
}
