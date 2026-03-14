import SigListClient from './SigListClient';
import './page.css';
import { safeFetch, fetchMe } from '@/util/fetchAPIData';

export const metadata = { title: 'SIG' };

export default async function SigListPage() {
  const [sigs, me, tags] = await Promise.allSettled([
    safeFetch('GET', '/api/sigs'),
    fetchMe(),
    safeFetch('GET', '/api/tags'),
  ]);

  if (sigs.status === 'rejected') {
    return <div>시그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['recruiting', 'active']);
  const visibleSigs = (Array.isArray(sigs.value) ? sigs.value : []).filter(
    (s) => s && allowed.has(s.status),
  );

  let myId = '';
  if (me.status === 'fulfilled' && me.value?.id != null) {
    myId = String(me.value.id);
  }

  const availableTags = Array.isArray(tags.status === 'fulfilled' ? tags.value : [])
    ? tags.value
    : [];

  const sigTagResults = await Promise.allSettled(
    visibleSigs.map((sig) => safeFetch('GET', `/api/sig/${sig.id}/tag`)),
  );

  const sigTagsBySigId = {};
  visibleSigs.forEach((sig, idx) => {
    const result = sigTagResults[idx];
    sigTagsBySigId[String(sig.id)] =
      result?.status === 'fulfilled' && Array.isArray(result.value) ? result.value : [];
  });

  return (
    <div id="SigListContainer">
      <SigListClient
        sigs={visibleSigs}
        myId={myId}
        availableTags={availableTags}
        sigTagsBySigId={sigTagsBySigId}
      />
    </div>
  );
}
