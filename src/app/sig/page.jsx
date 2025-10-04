import SigListClient from './SigListClient';
import './page.css';
import { fetchSigs, fetchUser } from '@/util/fetchAPIData';

export const metadata = { title: 'SIG' };

export default async function SigListPage() {
  const sigs = await fetchSigs();
  const me = await fetchUser();

  if (!Array.isArray(sigs)) {
    return <div>시그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['surveying', 'recruiting', 'active']);
  const visibleSigs = sigs.filter((s) => allowed.has(s.status));

  return (
    <div id="SigListContainer">
      <SigListClient sigs={visibleSigs} myId={me?.id ? String(me.id) : ''} />
    </div>
  );
}
