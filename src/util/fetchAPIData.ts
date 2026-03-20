import { handleApiRequest } from '@/app/api/apiWrapper';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

interface HandleApiRequestOptions {
  params?: Record<string, string | string[]>;
  query?: Record<string, string | number | boolean | null | undefined>;
}

interface ApiResponseLike {
  ok: boolean;
  status: number;
  text(): Promise<string>;
  json(): Promise<any>;
}

type HandleApiRequest = (
  method: string,
  path: string,
  options?: HandleApiRequestOptions,
  request?: Request,
) => Promise<ApiResponseLike>;

const typedHandleApiRequest = handleApiRequest as HandleApiRequest;

export interface BoardInfo {
  id: string | number;
  code: string;
  description: string;
  [key: string]: unknown;
}

export interface GlobalStatus {
  id: number;
  year: number;
  semester: number;
  status: string;
  updated_at: string;
}

export interface KvFetchResponse {
  value?: unknown;
}

export interface SettledRejected {
  status: 'rejected';
  reason: unknown;
}

export type KvValueResult =
  | { status: 'fulfilled'; value: string }
  | { status: 'rejected'; reason: string };

export interface BaseTarget {
  id?: number | string | null;
  content_id?: number | string | null;
  title?: string;
  name?: string;
  label?: string;
  year?: number | string | null;
  semester?: number | string | null;
  status?: string;
  [key: string]: unknown;
}

export interface NormalizedTarget extends BaseTarget {
  id: number | string | null;
  title: string;
  year: number | null;
  semester: number | null;
  status: string;
}

export interface TargetWithContentMembers extends BaseTarget {
  content: string;
  members: unknown[];
}

export interface FundApplyCreateData {
  boardInfo: BoardInfo;
  globalStatus: GlobalStatus | null;
  prevTerm: { year: number; semester: number } | null;
  sigs: NormalizedTarget[];
  pigs: NormalizedTarget[];
  prevSigs: NormalizedTarget[];
  prevPigs: NormalizedTarget[];
}

/**
 * Fetches from API and handles errors.
 *
 * @param method - The HTTP method (e.g., "POST").
 * @param path - A template string for the path (e.g., "/executive/user/{id}").
 * @param options - Optional additional fetch options.
 * @param options.params - The Next.js `params` object from the route handler.
 * @param options.query - Object for URL query parameters (e.g., { page: 1 }).
 * @param request - If included, fetch with body from it. The incoming Next.js Request object.
 * @returns Promise that resolves with response body or rejects on non-OK response.
 */
export async function safeFetch<T = any>(
  method: string,
  path: string,
  options: HandleApiRequestOptions = {},
  request?: Request,
): Promise<T> {
  const res = await typedHandleApiRequest(method, path, options, request);
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`${res.status} ${errText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Fetches current user data.
 *
 * @returns Current user data.
 */
export async function fetchMe<T = any>(): Promise<T> {
  return safeFetch<T>('GET', `/api/user/profile`);
}

/**
 * Fetches all users.
 *
 * @returns All users.
 */
export async function fetchUsers<T = any>(): Promise<T> {
  return safeFetch<T>('GET', `/api/executive/users`);
}

/**
 * Fetches board data.
 *
 * @param boardIds - Ids of the target boards to fetch.
 * @returns Promise that always resolves to object that contains information for each boards.
 */
export async function fetchBoards<T = any>(
  boardIds: number[],
): Promise<PromiseSettledResult<T>[]> {
  return Promise.allSettled(boardIds.map((id) => safeFetch<T>('GET', `/api/board/${id}`)));
}

/**
 * Fetches all sigs, along with their respective article content and sig members.
 *
 * @returns Promise that resolves to object that contains information for each sigs.
 */
export async function fetchSigs<T extends BaseTarget = BaseTarget>(): Promise<
  PromiseSettledResult<TargetWithContentMembers & T>[]
> {
  const softFetch = async <R = any>(path: string): Promise<R | null> => {
    try {
      const res = await typedHandleApiRequest('GET', path);
      if (!res.ok) return null;
      return (await res.json().catch(() => null)) as R | null;
    } catch {
      return null;
    }
  };

  const sigsRaw = await safeFetch<T[]>('GET', '/api/sigs');

  const sigsWithContentMembers = await Promise.allSettled(
    (Array.isArray(sigsRaw) ? sigsRaw : []).map(async (sig) => {
      const [article, members] = await Promise.all([
        softFetch<{ content?: string }>(`/api/article/${sig.content_id}`),
        softFetch<unknown[]>(`/api/sig/${sig.id}/members`),
      ]);

      return {
        ...sig,
        content: article?.content ?? '',
        members: Array.isArray(members) ? members : [],
      };
    }),
  );

  return sigsWithContentMembers;
}

/**
 * Fetches all pigs, along with their respective article content and pig members.
 *
 * @returns Promise that resolves to object that contains information for each pigs.
 */
export async function fetchPigs<T extends BaseTarget = BaseTarget>(): Promise<
  PromiseSettledResult<TargetWithContentMembers & T>[]
> {
  const softFetch = async <R = any>(path: string): Promise<R | null> => {
    try {
      const res = await typedHandleApiRequest('GET', path);
      if (!res.ok) return null;
      return (await res.json().catch(() => null)) as R | null;
    } catch {
      return null;
    }
  };

  const pigsRaw = await safeFetch<T[]>('GET', '/api/pigs');

  const pigsWithContentMembers = await Promise.allSettled(
    (Array.isArray(pigsRaw) ? pigsRaw : []).map(async (pig) => {
      const [article, members] = await Promise.all([
        softFetch<{ content?: string }>(`/api/article/${pig.content_id}`),
        softFetch<unknown[]>(`/api/pig/${pig.id}/members`),
      ]);

      return {
        ...pig,
        content: article?.content ?? '',
        members: Array.isArray(members) ? members : [],
      };
    }),
  );

  return pigsWithContentMembers;
}

/**
 * Fetches all majors.
 *
 * @returns All majors.
 */
export async function fetchMajors<T = any>(): Promise<T> {
  return safeFetch<T>('GET', '/api/majors');
}

/**
 * Fetches Discord bot status - logged in or not.
 *
 * @returns Whether Discord bot is logged in or not.
 */
export async function fetchDiscordBotStatus(): Promise<boolean> {
  const body = await safeFetch<{ logged_in?: boolean }>('GET', '/api/bot/discord/status');
  return Boolean(body.logged_in);
}

/**
 * Fetches current SCSC global status.
 *
 * @returns Current SCSC global status.
 */
export async function fetchSCSCGlobalStatus(): Promise<GlobalStatus> {
  return safeFetch<GlobalStatus>('GET', '/api/scsc/global/status');
}

/**
 * Fetches executive candidates from executive and president lists, merges duplicates, and sorts by name.
 *
 * @returns Merged executive candidate list.
 */
export async function fetchExecutiveCandidates<
  T extends Record<string, any> = Record<string, any>,
>(): Promise<T[]> {
  const [execRes, prezRes] = await Promise.all([
    typedHandleApiRequest('GET', '/api/executive/users', { query: { user_role: 'executive' } }),
    typedHandleApiRequest('GET', '/api/executive/users', { query: { user_role: 'president' } }),
  ]);

  const execList = (execRes.ok ? await execRes.json().catch(() => []) : []) as T[];
  const prezList = (prezRes.ok ? await prezRes.json().catch(() => []) : []) as T[];

  const merged = new Map<string | number, T>();
  for (const entry of [
    ...(Array.isArray(execList) ? execList : []),
    ...(Array.isArray(prezList) ? prezList : []),
  ]) {
    if (!entry || typeof entry !== 'object') continue;
    const key =
      entry.id ?? entry.email ?? `${String(entry.name || '')}-${String(entry.phone || '')}`;
    if (!merged.has(key)) merged.set(key, entry);
  }

  return Array.from(merged.values()).sort((a, b) => {
    const nameA = String(a?.name || '');
    const nameB = String(b?.name || '');
    return nameA.localeCompare(nameB, 'ko');
  });
}

/**
 * Get a single KV value.
 * Returns trimmed string or '' (if not set / invalid).
 *
 * @param key - KV key
 * @returns Trimmed string value or empty string
 */
export async function getKVValue(key: string): Promise<string> {
  try {
    const j = await safeFetch<KvFetchResponse>('GET', `/api/kv/${encodeURIComponent(key)}`);
    const v = j?.value;
    return typeof v === 'string' && v.trim() ? v.trim() : '';
  } catch {
    return '';
  }
}

/**
 * Get multiple KV values in parallel.
 *
 * @param keys - KV keys
 * @returns Key-value result map
 */
export async function getKVValues(keys: string[]): Promise<Record<string, KvValueResult>> {
  const list = Array.isArray(keys) ? keys : [];
  const results = await Promise.allSettled(
    list.map((k) =>
      safeFetch<KvFetchResponse>('GET', `/api/kv/${encodeURIComponent(String(k))}`),
    ),
  );

  const out: Record<string, KvValueResult> = {};
  for (let i = 0; i < list.length; i++) {
    const key = String(list[i]);
    const r = results[i];
    if (r.status === 'fulfilled') {
      const raw = r.value?.value;
      out[key] = { status: 'fulfilled', value: typeof raw === 'string' ? raw : '' };
    } else {
      out[key] = { status: 'rejected', reason: String(r.reason ?? '') };
    }
  }
  return out;
}

/**
 * Set a single KV value (string or null).
 *
 * @param key - KV key
 * @param value - KV value
 * @returns API response
 */
export async function setKVValue<T = any>(
  key: string,
  value: string | null | undefined,
): Promise<T> {
  const body = { value: typeof value === 'string' ? value : null };
  const req = new Request('http://dummy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return safeFetch<T>('POST', `/api/kv/${encodeURIComponent(key)}/update`, {}, req).catch(
    async (e) => {
      throw e;
    },
  );
}

/**
 * Set multiple KV values in parallel.
 *
 * @param entries - KV entries
 * @returns { key: true/false } success map
 */
export async function setKVValues(
  entries: Record<string, string | null | undefined>,
): Promise<Record<string, boolean>> {
  const pairs = Object.entries(entries || {});
  const results = await Promise.allSettled(
    pairs.map(async ([k, v]) => {
      await setKVValue(k, (v ?? '') === '' ? null : String(v));
      return [k, true] as const;
    }),
  );
  const out: Record<string, boolean> = {};
  for (let i = 0; i < results.length; i++) {
    const [k] = pairs[i];
    out[k] = results[i].status === 'fulfilled';
  }
  return out;
}

/**
 * Fetches initial data for the SIG/PIG fund-apply create page.
 *
 * - Current-term list (sigs/pigs): filters by status only (recruiting/active) to preserve existing behavior.
 * - Previous-term list (prevSigs/prevPigs): filters only by (year, semester) and does NOT filter by status.
 * - Term resolution: prefers /api/scsc/global/status; if missing, falls back to inferring the latest (year, semester)
 *   from returned sig/pig records.
 *
 * @param boardId - Board id for the fund-apply board (default: 6).
 * @returns Data required by FundApplyClient.
 */
export async function fetchFundApplyCreateData(boardId = 6): Promise<FundApplyCreateData> {
  const asArray = (v: unknown): Record<string, any>[] => {
    if (Array.isArray(v)) return v as Record<string, any>[];
    if (v && typeof v === 'object') {
      const obj = v as Record<string, unknown>;
      if (Array.isArray(obj.items)) return obj.items as Record<string, any>[];
      if (Array.isArray(obj.data)) return obj.data as Record<string, any>[];
      if (Array.isArray(obj.results)) return obj.results as Record<string, any>[];
      if (Array.isArray(obj.sigs)) return obj.sigs as Record<string, any>[];
      if (Array.isArray(obj.pigs)) return obj.pigs as Record<string, any>[];
    }
    return [];
  };

  const normalizeTargets = (list: unknown): NormalizedTarget[] =>
    asArray(list)
      .filter((x) => x && typeof x === 'object')
      .map((x) => ({
        ...x,
        id: x.id ?? null,
        title: x.title ?? x.name ?? x.label ?? '',
        year:
          typeof x.year === 'number'
            ? x.year
            : Number.isFinite(Number(x.year))
              ? Number(x.year)
              : null,
        semester:
          typeof x.semester === 'number'
            ? x.semester
            : Number.isFinite(Number(x.semester))
              ? Number(x.semester)
              : null,
        status: typeof x.status === 'string' ? x.status : '',
      }));

  const calcPrevTerm = (
    term: { year: number; semester: number } | null,
  ): { year: number; semester: number } | null => {
    if (!term || typeof term.year !== 'number' || typeof term.semester !== 'number') {
      return null;
    }
    if (term.semester === 1) return { year: term.year - 1, semester: 4 };
    return { year: term.year, semester: term.semester - 1 };
  };

  const [boardsSettled, globalStatus] = await Promise.all([
    fetchBoards<BoardInfo>([boardId]),
    fetchSCSCGlobalStatus().catch(() => null),
  ]);

  const boardInfo: BoardInfo =
    Array.isArray(boardsSettled) && boardsSettled[0]?.status === 'fulfilled'
      ? boardsSettled[0].value
      : { id: String(boardId), code: String(boardId), description: '' };

  const currentTerm = globalStatus
    ? {
        year: globalStatus.year,
        semester: globalStatus.semester,
        status: globalStatus.status,
      }
    : null;

  const prevTerm = calcPrevTerm(currentTerm);

  if (!currentTerm || !prevTerm) {
    return {
      boardInfo,
      globalStatus,
      prevTerm,
      sigs: [],
      pigs: [],
      prevSigs: [],
      prevPigs: [],
    };
  }

  const [currentSigsRaw, prevSigsRaw, currentPigsRaw, prevPigsRaw] = await Promise.all([
    safeFetch('GET', '/api/sigs', {
      query: {
        year: currentTerm.year,
        semester: currentTerm.semester,
        status: currentTerm.status,
      },
    }).catch(() => []),
    safeFetch('GET', '/api/sigs', {
      query: { year: prevTerm.year, semester: prevTerm.semester },
    }).catch(() => []),
    safeFetch('GET', '/api/pigs', {
      query: {
        year: currentTerm.year,
        semester: currentTerm.semester,
        status: currentTerm.status,
      },
    }).catch(() => []),
    safeFetch('GET', '/api/pigs', {
      query: { year: prevTerm.year, semester: prevTerm.semester },
    }).catch(() => []),
  ]);

  const sigs = normalizeTargets(currentSigsRaw);
  const pigs = normalizeTargets(currentPigsRaw);
  const prevSigs = normalizeTargets(prevSigsRaw);
  const prevPigs = normalizeTargets(prevPigsRaw);

  return { boardInfo, globalStatus, prevTerm, sigs, pigs, prevSigs, prevPigs };
}
