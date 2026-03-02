import SigListClient from './SigListClient';
import './page.css';
import { fetchMe } from '@/util/fetchAPIData';
import { handleApiRequest } from '@/app/api/apiWrapper';

export const metadata = { title: 'SIG' };

async function safeFetch(method, path, options = {}, request) {
  const res = await handleApiRequest(method, path, options, request);
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`${res.status} ${errText}`);
  }
  return res.json();
}

export default async function SigListPage() {
  const [sigs, me] = await Promise.allSettled([safeFetch('GET', '/api/sigs'), fetchMe()]);

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
