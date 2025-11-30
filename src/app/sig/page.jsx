import SigListClient from './SigListClient';
import './page.css';
import { fetchSigs, fetchMe } from '@/util/fetchAPIData';
import ClientPageTracker from '@/components/ClientPageTracker';

export const metadata = { title: 'SIG' };

export default async function SigListPage() {
  const [sigs, me] = await Promise.allSettled([fetchSigs(), fetchMe()]);

  if (sigs.status === 'rejected') {
    return <div>시그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['recruiting', 'active']);
  const visibleSigs = sigs.value
    .filter((s) => s.status === 'fulfilled')
    .map((s) => s.value)
    .filter((s) => allowed.has(s.status));

  let myId = '';
  if (me.status === 'fulfilled') {
    myId = me.value.id;
  }

  return (
    <div id="SigListContainer">
      <ClientPageTracker eventName="SIG List Viewed" />
      <SigListClient sigs={visibleSigs} myId={myId} />
    </div>
  );
}
