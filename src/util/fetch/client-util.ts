import { fetchBackendClientJson, fetchBackendClient } from './client';
import type {
  AcademicTerm,
  BaseTarget,
  BoardInfo,
  DiscordBotStatusResponse,
  GlobalStatus,
  NormalizedTarget,
} from '@/types/system';
import type { ExecutiveCandidate, UserProfile, UserSummary } from '@/types/user';

type KvResponse = {
  value?: string;
};

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

export async function getKvsClient(keys: string[]): Promise<string[]> {
  const list = Array.isArray(keys) ? keys : [];
  const results = await Promise.allSettled(
    list.map((key) =>
      fetchBackendClientJson<KvResponse>(`/api/kv/${encodeURIComponent(key)}`, {}, true),
    ),
  );

  return results.map((result) =>
    result.status === 'fulfilled' ? (result.value.value ?? '') : '',
  );
}

export async function getKvClient(key: string): Promise<string> {
  const [value] = await getKvsClient([key]);
  return value ?? '';
}

export async function fetchMajors<T = unknown[]>(): Promise<T> {
  return fetchBackendClientJson<T>('/api/majors', {}, true);
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
  return fetchBackendClientJson<GlobalStatus>('/api/scsc/global/status', { method: 'GET' });
}

export async function fetchUsers<T extends UserProfile[] = UserProfile[]>(): Promise<T> {
  return fetchBackendClientJson<T>('/api/executive/users', { method: 'GET' });
}

export async function fetchUserSummaries<
  T extends UserSummary[] = UserSummary[],
>(): Promise<T> {
  return fetchBackendClientJson<T>('/api/executive/users/summary', { method: 'GET' });
}

export async function fetchBoards<T extends BoardInfo = BoardInfo>(
  boardIds: number[],
): Promise<PromiseSettledResult<T>[]> {
  return Promise.allSettled(
    boardIds.map((id) => fetchBackendClientJson<T>(`/api/board/${id}`, { method: 'GET' })),
  );
}

export async function fetchDiscordBotStatus(): Promise<boolean> {
  const body = await fetchBackendClientJson<DiscordBotStatusResponse>(
    '/api/bot/discord/status',
    { method: 'GET' },
  );
  return body.logged_in === true;
}

export async function fetchExecutiveCandidates<
  T extends ExecutiveCandidate = ExecutiveCandidate,
>(): Promise<T[]> {
  const [execRes, prezRes] = await Promise.all([
    fetchBackendClient('/api/executive/users?user_role=executive', {
      method: 'GET',
    }),
    fetchBackendClient('/api/executive/users?user_role=president', {
      method: 'GET',
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
    fetchBackendClientJson(
      `/api/sigs?year=${currentTerm.year}&semester=${currentTerm.semester}&status=${globalStatus?.status}`,
      {
        method: 'GET',
      },
    ).catch(() => []),
    fetchBackendClientJson(`/api/sigs?year=${prevTerm.year}&semester=${prevTerm.semester}`, {
      method: 'GET',
    }).catch(() => []),
    fetchBackendClientJson(
      `/api/pigs?year=${currentTerm.year}&semester=${currentTerm.semester}&status=${globalStatus?.status}`,
      {
        method: 'GET',
      },
    ).catch(() => []),
    fetchBackendClientJson(`/api/pigs?year=${prevTerm.year}&semester=${prevTerm.semester}`, {
      method: 'GET',
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
