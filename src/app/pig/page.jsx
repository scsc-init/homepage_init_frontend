import PigListClient from './PigListClient';
import './page.css';
import { fetchMe } from '@/util/fetchAPIData';
import { handleApiRequest } from '@/app/api/apiWrapper';

export const metadata = { title: 'PIG' };

async function safeFetch(method, path, options = {}, request) {
  const res = await handleApiRequest(method, path, options, request);
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`${res.status} ${errText}`);
  }
  return res.json();
}

export default async function PigListPage() {
  const [pigs, me] = await Promise.allSettled([safeFetch('GET', '/api/pigs'), fetchMe()]);

  if (pigs.status === 'rejected') {
    return <div>피그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['recruiting', 'active']);
  const visiblePigs = (Array.isArray(pigs.value) ? pigs.value : []).filter((p) =>
    allowed.has(p.status),
  );

  let myId = '';
  if (me.status === 'fulfilled' && me.value?.id) {
    myId = String(me.value.id);
  }

  return (
    <div id="PigListContainer">
      <PigListClient pigs={visiblePigs} myId={myId} />
    </div>
  );
}
