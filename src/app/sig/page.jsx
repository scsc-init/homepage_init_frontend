import SigListClient from './SigListClient';
import './page.css';
import { safeServerFetch, fetchMe } from '@/util/fetchAPIData';

export const metadata = { title: 'SIG' };

export default async function SigListPage() {
  const [sigs, me] = await Promise.allSettled([safeServerFetch('GET', '/api/sigs'), fetchMe()]);

  if (sigs.status === 'rejected') {
    return <div>시그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['recruiting', 'active']);
  const visibleSigs = (Array.isArray(sigs.value) ? sigs.value : []).filter((s) =>
    allowed.has(s.status),
  );

  let myId = '';
  if (me.status === 'fulfilled' && me.value?.id) {
    myId = String(me.value.id);
  }

  return (
    <div id="SigListContainer">
      <SigListClient sigs={visibleSigs} myId={myId} />
    </div>
  );
}
