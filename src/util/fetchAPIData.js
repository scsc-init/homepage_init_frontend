import { handleApiRequest } from '@/app/api/apiWrapper';

/**
 * Fetches from API and handles errors.
 *
 * @param {string} method - The HTTP method (e.g., "POST").
 * @param {string} path - A template string for the path (e.g., "/executive/user/{id}").
 * @param {object} [options] - Optional additional fetch options.
 * @param {object} [options.params] - The Next.js `params` object from the route handler.
 * @param {object} [options.query] - Object for URL query parameters (e.g., { page: 1 }).
 * @param {Request} request - If included, fetch with body from it. The incoming Next.js Request object.
 * @returns {Promise<any>} - Promise that resolves with response body or rejects on non-OK response.
 */
async function safeFetch(method, path, options = {}, request) {
  const res = await handleApiRequest(method, path, options, request);
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`${res.status} ${errText}`);
  }
  return res.json();
}

/**
 * Fetches current user data.
 */
export async function fetchMe() {
  return safeFetch('GET', `/api/user/profile`);
}

/**
 * Fetches all users.
 */
export async function fetchUsers() {
  return safeFetch('GET', `/api/users`);
}

/**
 * Fetches board data.
 *
 * @param {number[]} boardIds - Ids of the target boards to fetch.
 * @returns {Promise<PromiseSettledResult<any>[]>} - Promise that always resolves to object that contains information for each boards.
 */
export async function fetchBoards(boardIds) {
  return Promise.allSettled(boardIds.map((id) => safeFetch('GET', `/api/board/${id}`)));
}

/**
 * Fetches all sigs, along with their respective article content and sig members.
 *
 * @returns {Promise<PromiseSettledResult<any>[]>} - Promise that resolves to object that contains information for each sigs.
 */
export async function fetchSigs() {
  try {
    const sigsRaw = await safeFetch('GET', '/api/sigs');
    const sigsWithContentMembers = await Promise.allSettled(
      sigsRaw.map(async (sig) => {
        try {
          const [article, members] = await Promise.all([
            safeFetch('GET', `/api/article/${sig.content_id}`),
            safeFetch('GET', `/api/sig/${sig.id}/members`),
          ]);
          return { ...sig, content: article.content, members: members };
        } catch (err) {
          throw new Error(`sig fetch failed: ${err}`);
        }
      }),
    );
    return sigsWithContentMembers;
  } catch (err) {
    throw err;
  }
}

/**
 * Fetches all pigs, along with their respective article content and pig members.
 *
 * @returns {Promise<PromiseSettledResult<any>[]>} - Promise that resolves to object that contains information for each pigs.
 */
export async function fetchPigs() {
  try {
    const pigsRaw = await safeFetch('GET', '/api/pigs');
    const pigsWithContentMembers = await Promise.allSettled(
      pigsRaw.map(async (pig) => {
        try {
          const [article, members] = await Promise.all([
            safeFetch('GET', `/api/article/${pig.content_id}`),
            safeFetch('GET', `/api/pig/${pig.id}/members`),
          ]);
          return { ...pig, content: article.content, members: members };
        } catch (err) {
          throw new Error(`pig fetch failed: ${err}`);
        }
      }),
    );
    return pigsWithContentMembers;
  } catch (err) {
    throw err;
  }
}

/**
 * Fetches all majors.
 */
export async function fetchMajors() {
  return safeFetch('GET', '/api/majors');
}

/**
 * Fetches Discord bot status - logged in or not.
 *
 * @returns {Promise<boolean>} - Whether Discord bot is logged in or not.
 */
export async function fetchDiscordBotStatus() {
  try {
    const body = await safeFetch('GET', '/api/bot/discord/status');
    return body.logged_in;
  } catch (err) {
    throw err;
  }
}

/**
 * Fetches current SCSC global status.
 *
 * @returns {Promise<{
 * id:number;
 * year:number;
 * semester:number;
 * status:string;
 * updated_at:string
 * }>} - Current SCSC global status.
 */
export async function fetchSCSCGlobalStatus() {
  return safeFetch('GET', '/api/scsc/global/status');
}

export async function fetchExecutiveCandidates() {
  const [execRes, prezRes] = await Promise.all([
    handleApiRequest('GET', '/api/users', { query: { user_role: 'executive' } }),
    handleApiRequest('GET', '/api/users', { query: { user_role: 'president' } }),
  ]);

  const execList = execRes.ok ? await execRes.json().catch(() => []) : [];
  const prezList = prezRes.ok ? await prezRes.json().catch(() => []) : [];

  const merged = new Map();
  for (const entry of [
    ...(Array.isArray(execList) ? execList : []),
    ...(Array.isArray(prezList) ? prezList : []),
  ]) {
    if (!entry || typeof entry !== 'object') continue;
    const key = entry.id || entry.email || `${entry.name || ''}-${entry.phone || ''}`;
    if (!merged.has(key)) merged.set(key, entry);
  }

  return Array.from(merged.values()).sort((a, b) => {
    const nameA = (a?.name || '').toString();
    const nameB = (b?.name || '').toString();
    return nameA.localeCompare(nameB, 'ko');
  });
}

/**
 * Get a single KV value.
 * Returns trimmed string or '' (if not set / invalid).
 */
export async function getKVValue(key) {
  try {
    const j = await safeFetch('GET', `/api/kv/${encodeURIComponent(key)}`);
    const v = j?.value;
    return typeof v === 'string' && v.trim() ? v.trim() : '';
  } catch {
    return '';
  }
}

/**
 * Get multiple KV values in parallel.
 * @param {string[]} keys
 * @returns {Promise<Record<string, {status: 'fulfilled', value: string} | {status: 'rejected', reason: string}>>}
 */
export async function getKVValues(keys) {
  const list = Array.isArray(keys) ? keys : [];
  const results = await Promise.allSettled(
    list.map((k) => safeFetch('GET', `/api/kv/${encodeURIComponent(String(k))}`)),
  );

  const out = {};
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
 */
export async function setKVValue(key, value) {
  const body = { value: typeof value === 'string' ? value : null };
  const req = new Request('http://dummy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return safeFetch('POST', `/api/kv/${encodeURIComponent(key)}/update`, {}, req).catch(
    async (e) => {
      throw e;
    },
  );
}

/**
 * Set multiple KV values in parallel.
 * @param {Record<string,string|null|undefined>} entries
 * @returns {Promise<Record<string,boolean>>} - { key: true/false } success map
 */
export async function setKVValues(entries) {
  const pairs = Object.entries(entries || {});
  const results = await Promise.allSettled(
    pairs.map(async ([k, v]) => {
      await setKVValue(k, (v ?? '') === '' ? null : String(v));
      return [k, true];
    }),
  );
  const out = {};
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
 * @param {number} boardId - Board id for the fund-apply board (default: 6).
 * @returns {Promise<{
 *  boardInfo: any;
 *  globalStatus: { id:number; year:number; semester:number; status:string; updated_at:string } | null;
 *  prevTerm: { year:number; semester:number } | null;
 *  sigs: any[];
 *  pigs: any[];
 *  prevSigs: any[];
 *  prevPigs: any[];
 * }>} - Data required by FundApplyClient.
 */
export async function fetchFundApplyCreateData(boardId = 6) {
  const asArray = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
      if (Array.isArray(v.items)) return v.items;
      if (Array.isArray(v.data)) return v.data;
      if (Array.isArray(v.results)) return v.results;
      if (Array.isArray(v.sigs)) return v.sigs;
      if (Array.isArray(v.pigs)) return v.pigs;
    }
    return [];
  };

  const normalizeTargets = (list) =>
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

  const calcPrevTerm = (term) => {
    if (!term || typeof term.year !== 'number' || typeof term.semester !== 'number')
      return null;
    if (term.semester === 1) return { year: term.year - 1, semester: 4 };
    return { year: term.year, semester: term.semester - 1 };
  };

  const [boardsSettled, globalStatus] = await Promise.all([
    fetchBoards([boardId]),
    fetchSCSCGlobalStatus().catch(() => null),
  ]);

  const boardInfo =
    Array.isArray(boardsSettled) && boardsSettled[0]?.status === 'fulfilled'
      ? boardsSettled[0].value
      : { id: String(boardId), code: String(boardId), description: '' };

  const currentTerm = globalStatus
    ? {
        year: globalStatus.year,
        semester: globalStatus.semester,
      }
    : null;

  const prevTerm = calcPrevTerm(currentTerm);

  if (!currentTerm)
    return {
      boardInfo,
      globalStatus,
      prevTerm,
      sigs: [],
      pigs: [],
      prevSigs: [],
      prevPigs: [],
    };

  const [
    currentActiveSigsRaw,
    currentRecruitingSigsRaw,
    prevSigsRaw,
    currentActivePigsRaw,
    currentRecruitingPigsRaw,
    prevPigsRaw,
  ] = await Promise.all([
    safeFetch('GET', '/api/sigs', {
      query: { year: currentTerm.year, semester: currentTerm.semester, status: 'active' },
    }).catch(() => []),
    safeFetch('GET', '/api/sigs', {
      query: { year: currentTerm.year, semester: currentTerm.semester, status: 'recruiting' },
    }).catch(() => []),
    safeFetch('GET', '/api/sigs', {
      query: { year: prevTerm.year, semester: prevTerm.semester },
    }).catch(() => []),
    safeFetch('GET', '/api/pigs', {
      query: { year: currentTerm.year, semester: currentTerm.semester, status: 'active' },
    }).catch(() => []),
    safeFetch('GET', '/api/pigs', {
      query: { year: currentTerm.year, semester: currentTerm.semester, status: 'recruiting' },
    }).catch(() => []),
    safeFetch('GET', '/api/pigs', {
      query: { year: prevTerm.year, semester: prevTerm.semester },
    }).catch(() => []),
  ]);

  const sigs = [
    ...normalizeTargets(currentActiveSigsRaw),
    ...normalizeTargets(currentRecruitingSigsRaw),
  ];
  const pigs = [
    ...normalizeTargets(currentActivePigsRaw),
    ...normalizeTargets(currentRecruitingPigsRaw),
  ];
  const prevSigs = normalizeTargets(prevSigsRaw);
  const prevPigs = normalizeTargets(prevPigsRaw);

  return { boardInfo, globalStatus, prevTerm, sigs, pigs, prevSigs, prevPigs };
}
