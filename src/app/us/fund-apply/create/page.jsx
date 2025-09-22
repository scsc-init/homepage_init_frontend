import FundApplyClient from './FundApplyClient';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';

export default async function FundApplyPage() {
  const [boardInfo, sigs, pigs] = await Promise.all([
    fetchBoardInfo('6'),
    fetchTargets('sig'),
    fetchTargets('pig'),
  ]);
  return <FundApplyClient boardInfo={boardInfo} sigs={sigs} pigs={pigs} />;
}

async function fetchBoardInfo(id) {
  const res = await fetch(`${getBaseUrl()}/api/board/${id}`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  if (!res.ok) return { id, description: '' };
  try {
    return await res.json();
  } catch {
    return { id, description: '' };
  }
}

function normalizeTargets(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((x, i) => ({
    id: x.id ?? x.ig_id ?? x.code ?? x.slug ?? `${i}`,
    title:
      x.title ?? x.name ?? x.sig_name ?? x.pig_name ?? x.displayName ?? x.label ?? String(x),
  }));
}

async function tryFetch(url) {
  const res = await fetch(url, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchTargets(type) {
  const base = getBaseUrl();
  const data = await tryFetch(`${base}/api/${type}s`);
  const arr = Array.isArray(data) ? data : (data?.items ?? data?.data ?? data?.results ?? []);
  const allowed = new Set(['active', 'surveying', 'recruiting']);
  const filtered = (Array.isArray(arr) ? arr : []).filter((x) =>
    allowed.has(String(x?.status || '').toLowerCase()),
  );
  const norm = normalizeTargets(filtered);
  if (norm.length) return norm;
  return [];
}
