import { handleApiRequest } from '@/app/api/apiWrapper';
import type { ExecutiveCandidate, UserProfile, UserSummary } from '@/types/user';

interface HandleApiRequestOptions {
  params?: Record<string, string | string[]>;
  query?: Record<string, string | number | boolean | undefined>;
}

interface ApiResponseLike {
  ok: boolean;
  status: number;
  text(): Promise<string>;
  json(): Promise<unknown>;
}

type HandleApiRequest = (
  method: string,
  path: string,
  options?: HandleApiRequestOptions,
  request?: Request,
) => Promise<ApiResponseLike>;

const typedHandleApiRequest = handleApiRequest as HandleApiRequest;

export interface BoardInfo {
  id: number;
  name: string;
  description: string;
  writing_permission_level: number;
  reading_permission_level: number;
  created_at: string;
  updated_at: string;
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
  key: string;
  value?: string;
}

export type KvValueResult =
  | { status: 'fulfilled'; value: string }
  | { status: 'rejected'; reason: string };

export interface ArticleContentResponse {
  id?: number;
  content?: string;
  [key: string]: unknown;
}

export interface DiscordBotStatusResponse {
  logged_in?: boolean;
}

export interface MajorInfo {
  id: number;
  name: string;
  short_name?: string;
  [key: string]: unknown;
}

export interface FundApplyTerm {
  year: number;
  semester: number;
}

export interface BaseTarget {
  id?: number;
  content_id?: number;
  title?: string;
  name?: string;
  label?: string;
  year?: number;
  semester?: number;
  status?: string;
  [key: string]: unknown;
}

export interface NormalizedTarget extends BaseTarget {
  title: string;
  status: string;
}

export interface TargetWithContentMembers extends BaseTarget {
  content: string;
  members: unknown[];
}

export interface FundApplyCreateData {
  boardInfo: BoardInfo;
  globalStatus?: GlobalStatus;
  prevTerm?: FundApplyTerm;
  sigs: NormalizedTarget[];
  pigs: NormalizedTarget[];
  prevSigs: NormalizedTarget[];
  prevPigs: NormalizedTarget[];
}

interface ApiListContainer {
  items?: Record<string, unknown>[];
  data?: Record<string, unknown>[];
  results?: Record<string, unknown>[];
  sigs?: Record<string, unknown>[];
  pigs?: Record<string, unknown>[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  return undefined;
}

function asArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter(isRecord);
  }

  if (!isRecord(value)) {
    return [];
  }

  const container = value as ApiListContainer;

  if (Array.isArray(container.items)) return container.items.filter(isRecord);
  if (Array.isArray(container.data)) return container.data.filter(isRecord);
  if (Array.isArray(container.results)) return container.results.filter(isRecord);
  if (Array.isArray(container.sigs)) return container.sigs.filter(isRecord);
  if (Array.isArray(container.pigs)) return container.pigs.filter(isRecord);

  return [];
}

function normalizeTarget(raw: Record<string, unknown>): NormalizedTarget {
  return {
    ...raw,
    id: toNumber(raw.id),
    content_id: toNumber(raw.content_id),
    title:
      toStringValue(raw.title) ?? toStringValue(raw.name) ?? toStringValue(raw.label) ?? '',
    year: toNumber(raw.year),
    semester: toNumber(raw.semester),
    status: toStringValue(raw.status) ?? '',
  };
}

async function softFetch<R>(path: string): Promise<R | undefined> {
  try {
    const res = await typedHandleApiRequest('GET', path);
    if (!res.ok) {
      return undefined;
    }
    return (await res.json().catch(() => undefined)) as R | undefined;
  } catch {
    return undefined;
  }
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
export async function safeFetch<T = unknown>(
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
export async function fetchMe(): Promise<UserProfile> {
  return safeFetch<UserProfile>('GET', '/api/user/profile');
}

/**
 * Fetches all users.
 *
 * @returns All users.
 */
export async function fetchUsers<T extends UserProfile[] = UserProfile[]>(): Promise<T> {
  return safeFetch<T>('GET', '/api/executive/users');
}

/**
 * Fetches executive user summaries.
 *
 * @returns User summaries.
 */
export async function fetchUserSummaries<
  T extends UserSummary[] = UserSummary[],
>(): Promise<T> {
  return safeFetch<T>('GET', '/api/executive/users/summary');
}

/**
 * Fetches board data.
 *
 * @param boardIds - Ids of the target boards to fetch.
 * @returns Promise that always resolves to object that contains information for each boards.
 */
export async function fetchBoards<T extends BoardInfo = BoardInfo>(
  boardIds: number[],
): Promise<PromiseSettledResult<T>[]> {
  return Promise.allSettled(boardIds.map((id) => safeFetch<T>('GET', `/api/board/${id}`)));
}

/**
 * Fetches all majors.
 *
 * @returns All majors.
 */
export async function fetchMajors<T extends MajorInfo[] = MajorInfo[]>(): Promise<T> {
  return safeFetch<T>('GET', '/api/majors');
}

/**
 * Fetches Discord bot status - logged in or not.
 *
 * @returns Whether Discord bot is logged in or not.
 */
export async function fetchDiscordBotStatus(): Promise<boolean> {
  const body = await safeFetch<DiscordBotStatusResponse>('GET', '/api/bot/discord/status');
  return body.logged_in === true;
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
  T extends ExecutiveCandidate = ExecutiveCandidate,
>(): Promise<T[]> {
  const [execRes, prezRes] = await Promise.all([
    typedHandleApiRequest('GET', '/api/executive/users', { query: { user_role: 'executive' } }),
    typedHandleApiRequest('GET', '/api/executive/users', { query: { user_role: 'president' } }),
  ]);

  const execList = (execRes.ok ? await execRes.json().catch(() => []) : []) as T[];
  const prezList = (prezRes.ok ? await prezRes.json().catch(() => []) : []) as T[];

  const merged = new Map<string, T>();
  for (const entry of [
    ...(Array.isArray(execList) ? execList : []),
    ...(Array.isArray(prezList) ? prezList : []),
  ]) {
    const key = entry.id || entry.email || entry.name;

    if (!merged.has(key)) {
      merged.set(key, entry);
    }
  }

  return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
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
    const v = j.value;
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
    list.map((k) => safeFetch<KvFetchResponse>('GET', `/api/kv/${encodeURIComponent(k)}`)),
  );

  const out: Record<string, KvValueResult> = {};
  for (let i = 0; i < list.length; i += 1) {
    const key = list[i] ?? '';
    const result = results[i];

    if (result.status === 'fulfilled') {
      out[key] = { status: 'fulfilled', value: result.value.value ?? '' };
      continue;
    }

    out[key] = { status: 'rejected', reason: String(result.reason ?? '') };
  }
  return out;
}

/**
 * Set a single KV value (string).
 *
 * @param key - KV key
 * @param value - KV value
 * @returns API response
 */
export async function setKVValue<T = unknown>(key: string, value: string): Promise<T> {
  const req = new Request('http://dummy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });

  return safeFetch<T>('POST', `/api/kv/${encodeURIComponent(key)}/update`, {}, req);
}

/**
 * Set multiple KV values in parallel.
 *
 * @param entries - KV entries
 * @returns { key: true/false } success map
 */
export async function setKVValues(
  entries: Record<string, string | undefined>,
): Promise<Record<string, boolean>> {
  const pairs = Object.entries(entries);
  const results = await Promise.allSettled(
    pairs.map(async ([k, v]) => {
      await setKVValue(k, v ?? '');
      return [k, true] as const;
    }),
  );

  const out: Record<string, boolean> = {};
  for (let i = 0; i < results.length; i += 1) {
    const pair = pairs[i];
    if (!pair) {
      continue;
    }
    const [key] = pair;
    out[key] = results[i]?.status === 'fulfilled';
  }
  return out;
}

/**
 * Fetches initial data for the SIG/PIG fund-apply create page.
 *
 * - Current-term list (sigs/pigs): filters by status only (recruiting/active) to preserve existing behavior.
 * - Previous-term list (prevSigs/prevPigs): filters only by (year, semester) and does NOT filter by status.
 * - Term resolution: uses /api/scsc/global/status as the source of truth.
 *   If global status is unavailable, this function returns empty lists.
 *
 * @param boardId - Board id for the fund-apply board (default: 6).
 * @returns Data required by FundApplyClient.
 */
export async function fetchFundApplyCreateData(boardId = 6): Promise<FundApplyCreateData> {
  const calcPrevTerm = (term?: FundApplyTerm): FundApplyTerm | undefined => {
    if (!term) {
      return undefined;
    }

    if (term.semester === 1) {
      return { year: term.year - 1, semester: 4 };
    }

    return { year: term.year, semester: term.semester - 1 };
  };

  const [boardsSettled, globalStatus] = await Promise.all([
    fetchBoards<BoardInfo>([boardId]),
    fetchSCSCGlobalStatus().catch(() => undefined),
  ]);

  const boardInfo: BoardInfo =
    Array.isArray(boardsSettled) && boardsSettled[0]?.status === 'fulfilled'
      ? boardsSettled[0].value
      : {
          id: boardId,
          name: '',
          description: '',
          writing_permission_level: 0,
          reading_permission_level: 0,
          created_at: '',
          updated_at: '',
        };

  const currentTerm = globalStatus
    ? {
        year: globalStatus.year,
        semester: globalStatus.semester,
      }
    : undefined;

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
        status: globalStatus?.status,
      },
    }).catch(() => []),
    safeFetch('GET', '/api/sigs', {
      query: { year: prevTerm.year, semester: prevTerm.semester },
    }).catch(() => []),
    safeFetch('GET', '/api/pigs', {
      query: {
        year: currentTerm.year,
        semester: currentTerm.semester,
        status: globalStatus?.status,
      },
    }).catch(() => []),
    safeFetch('GET', '/api/pigs', {
      query: { year: prevTerm.year, semester: prevTerm.semester },
    }).catch(() => []),
  ]);

  const sigs = asArray(currentSigsRaw).map(normalizeTarget);
  const pigs = asArray(currentPigsRaw).map(normalizeTarget);
  const prevSigs = asArray(prevSigsRaw).map(normalizeTarget);
  const prevPigs = asArray(prevPigsRaw).map(normalizeTarget);

  return { boardInfo, globalStatus, prevTerm, sigs, pigs, prevSigs, prevPigs };
}
