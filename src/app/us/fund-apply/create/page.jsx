import FundApplyClient from './FundApplyClient';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';
import { fetchBoards, fetchSCSCGlobalStatus } from '@/util/fetchAPIData';

export default async function FundApplyPage() {
  const [boardsSettled, sigs, pigs, sigsAll, pigsAll, globalStatus] = await Promise.all([
    fetchBoards([6]),
    fetchTargets('sig', true),
    fetchTargets('pig', true),
    fetchTargets('sig', false),
    fetchTargets('pig', false),
    fetchSCSCGlobalStatus(),
  ]);

  const boardInfo =
    Array.isArray(boardsSettled) && boardsSettled[0]?.status === 'fulfilled'
      ? boardsSettled[0].value
      : { id: '6', description: '' };

  return (
    <FundApplyClient
      boardInfo={boardInfo}
      sigs={sigs}
      pigs={pigs}
      sigsAll={sigsAll}
      pigsAll={pigsAll}
      globalStatus={globalStatus}
    />
  );
}

function normalizeTargets(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((x, i) => ({
    id: x.id ?? x.ig_id ?? x.code ?? x.slug ?? `${i}`,
    title:
      x.title ?? x.name ?? x.sig_name ?? x.pig_name ?? x.displayName ?? x.label ?? String(x),
    year: x.year ?? x.term_year ?? x.academic_year ?? null,
    semester: x.semester ?? x.term_semester ?? x.term ?? null,
    status: x.status ?? null,
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

async function fetchTargets(type, filterStatus) {
  const base = getBaseUrl();
  const data = await tryFetch(`${base}/api/${type}s`);
  const arr = Array.isArray(data) ? data : (data?.items ?? data?.data ?? data?.results ?? []);

  const list = Array.isArray(arr) ? arr : [];
  const used = filterStatus
    ? list.filter((x) =>
        new Set(['recruiting', 'active']).has(String(x?.status || '').toLowerCase()),
      )
    : list;

  const norm = normalizeTargets(used);
  return norm.length ? norm : [];
}
