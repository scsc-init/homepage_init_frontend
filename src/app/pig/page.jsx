// src/app/pig/page.jsx
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';
import PigListClient from './PigListClient';
import './page.css';
export const metadata = { title: 'PIG' };

export default async function PigListPage() {
  const res = await fetch(`${getBaseUrl()}/api/pigs`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });

  if (!res.ok) {
    return <div>피그 정보를 불러올 수 없습니다.</div>;
  }

  const pigs = await res.json();
  if (!Array.isArray(pigs)) return <div>로딩중...</div>;

  const allowed = new Set(['surveying', 'recruiting', 'active']);
  const visiblePigs = pigs.filter((s) => allowed.has(s.status));

  return (
    <div id="PigListContainer">
      <PigListClient pigs={visiblePigs} />
    </div>
  );
}
