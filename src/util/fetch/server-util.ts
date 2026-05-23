// @/util/fetch/server-util.ts

import type {
  AcademicTerm,
  BaseTarget,
  BoardInfo,
  DiscordBotStatusResponse,
  GlobalStatus,
  KvFetchResponse,
  KvValueResult,
  NormalizedTarget,
} from '@/types/system';
import type { ExecutiveCandidate, UserProfile, UserSummary } from '@/types/user';
import { fetchBackendServer, fetchBackendServerJson } from './server';

export interface TargetWithContentMembers extends BaseTarget {
  content: string;
  members: unknown[];
}

export interface FundApplyCreateData {
  boardInfo: BoardInfo;
  globalStatus?: GlobalStatus;
  prevTerm?: AcademicTerm;
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
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function toStringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function asArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.filter(isRecord);
  if (!isRecord(value)) return [];

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

export async function fetchGlobalStatus(): Promise<GlobalStatus> {
  return fetchBackendServerJson<GlobalStatus>('GET', '/api/scsc/global/status');
}

export async function fetchSCSCGlobalStatus(): Promise<GlobalStatus> {
  return fetchGlobalStatus();
}

export async function fetchCurrentUserProfile(): Promise<UserProfile | null> {
  const res = await fetchBackendServer('GET', '/api/user/profile');
  return res.ok ? ((await res.json()) as UserProfile) : null;
}

export async function fetchUsers<T extends UserProfile[] = UserProfile[]>(): Promise<T> {
  return fetchBackendServerJson<T>('GET', '/api/executive/users');
}

export async function fetchUserSummaries<
  T extends UserSummary[] = UserSummary[],
>(): Promise<T> {
  return fetchBackendServerJson<T>('GET', '/api/executive/users/summary');
}

export async function fetchBoards<T extends BoardInfo = BoardInfo>(
  boardIds: number[],
): Promise<PromiseSettledResult<T>[]> {
  return Promise.allSettled(
    boardIds.map((id) => fetchBackendServerJson<T>('GET', `/api/board/${id}`)),
  );
}

export async function fetchDiscordBotStatus(): Promise<boolean> {
  const body = await fetchBackendServerJson<DiscordBotStatusResponse>(
    'GET',
    '/api/bot/discord/status',
  );
  return body.logged_in === true;
}

export async function fetchExecutiveCandidates<
  T extends ExecutiveCandidate = ExecutiveCandidate,
>(): Promise<T[]> {
  const [execRes, prezRes] = await Promise.all([
    fetchBackendServer('GET', '/api/executive/users', {
      query: { user_role: 'executive' },
    }),
    fetchBackendServer('GET', '/api/executive/users', {
      query: { user_role: 'president' },
    }),
  ]);

  const execList = (execRes.ok ? await execRes.json().catch(() => []) : []) as T[];
  const prezList = (prezRes.ok ? await prezRes.json().catch(() => []) : []) as T[];

  const merged = new Map<string, T>();
  for (const entry of [
    ...(Array.isArray(execList) ? execList : []),
    ...(Array.isArray(prezList) ? prezList : []),
  ]) {
    const key = entry.id || entry.email || entry.name;
    if (!merged.has(key)) merged.set(key, entry);
  }

  return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}

export async function getKVValues(keys: string[]): Promise<Record<string, KvValueResult>> {
  const list = Array.isArray(keys) ? keys : [];
  const results = await Promise.allSettled(
    list.map((k) =>
      fetchBackendServerJson<KvFetchResponse>('GET', `/api/kv/${encodeURIComponent(k)}`),
    ),
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

export async function fetchFundApplyCreateData(boardId = 6): Promise<FundApplyCreateData> {
  const calcPrevTerm = (term?: AcademicTerm): AcademicTerm | undefined => {
    if (!term) return undefined;
    if (term.semester === 1) return { year: term.year - 1, semester: 4 };
    return { year: term.year, semester: term.semester - 1 };
  };

  const [boardsSettled, globalStatus] = await Promise.all([
    fetchBoards<BoardInfo>([boardId]),
    fetchGlobalStatus().catch(() => undefined),
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
    ? { year: globalStatus.year, semester: globalStatus.semester }
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
    fetchBackendServerJson('GET', '/api/sigs', {
      query: {
        year: currentTerm.year,
        semester: currentTerm.semester,
        status: globalStatus?.status,
      },
    }).catch(() => []),
    fetchBackendServerJson('GET', '/api/sigs', {
      query: { year: prevTerm.year, semester: prevTerm.semester },
    }).catch(() => []),
    fetchBackendServerJson('GET', '/api/pigs', {
      query: {
        year: currentTerm.year,
        semester: currentTerm.semester,
        status: globalStatus?.status,
      },
    }).catch(() => []),
    fetchBackendServerJson('GET', '/api/pigs', {
      query: { year: prevTerm.year, semester: prevTerm.semester },
    }).catch(() => []),
  ]);

  return {
    boardInfo,
    globalStatus,
    prevTerm,
    sigs: asArray(currentSigsRaw).map(normalizeTarget),
    pigs: asArray(currentPigsRaw).map(normalizeTarget),
    prevSigs: asArray(prevSigsRaw).map(normalizeTarget),
    prevPigs: asArray(prevPigsRaw).map(normalizeTarget),
  };
}
