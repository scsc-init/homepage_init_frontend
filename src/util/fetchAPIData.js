import { handleApiRequest } from '@/app/api/apiWrapper';

export async function fetchMe() {
  const res = await handleApiRequest('GET', `/api/user/profile`);
  return res.ok ? await res.json() : null;
}

export async function fetchUsers() {
  const res = await handleApiRequest('GET', `/api/users`);
  return res.ok ? await res.json() : null;
}

export async function fetchBoards(targetBoardIds) {
  const boardResults = await Promise.all(
    targetBoardIds.map(async (id) => {
      const res = await handleApiRequest('GET', `/api/board/${id}`);
      return res.ok ? await res.json() : null;
    }),
  );
  return boardResults.filter(Boolean);
}

export async function fetchSigs() {
  const res = await handleApiRequest('GET', `/api/sigs`);
  if (!res.ok) return;
  const sigsRaw = await res.json();
  const sigsWithContentMembers = await Promise.all(
    sigsRaw.map(async (sig) => {
      const [articleRes, membersRes] = await Promise.all([
        handleApiRequest('GET', `/api/article/${sig.content_id}`),
        handleApiRequest('GET', `/api/sig/${sig.id}/members`),
      ]);
      const article = articleRes.ok ? await articleRes.json() : { content: '' };
      const members = membersRes.ok ? await membersRes.json() : [];
      return { ...sig, content: article.content, members: members };
    }),
  );
  return sigsWithContentMembers;
}

export async function fetchPigs() {
  const res = await handleApiRequest('GET', `/api/pigs`);
  if (!res.ok) return;
  const pigsRaw = await res.json();
  const pigsWithContentMembers = await Promise.all(
    pigsRaw.map(async (pig) => {
      const [articleRes, membersRes] = await Promise.all([
        handleApiRequest('GET', `/api/article/${pig.content_id}`),
        handleApiRequest('GET', `/api/pig/${pig.id}/members`),
      ]);
      const article = articleRes.ok ? await articleRes.json() : { content: '' };
      const members = membersRes.ok ? await membersRes.json() : [];
      return { ...pig, content: article.content, members: members };
    }),
  );
  return pigsWithContentMembers;
}

export async function fetchMajors() {
  const res = await handleApiRequest('GET', '/api/majors');
  if (res.ok) return await res.json();
}

export async function fetchDiscordBotStatus() {
  const res = await handleApiRequest('GET', '/api/bot/discord/status');
  if (res.ok) return await res.json();
}

export async function fetchSCSCGlobalStatus() {
  const res = await handleApiRequest('GET', '/api/scsc/global/status');
  if (res.ok) return await res.json();
}

export async function fetchDiscordInviteLink() {
  const res = await handleApiRequest('GET', '/api/bot/discord/general/get_invite');
  if (res.ok) {
    const resData = await res.json();
    return resData.result.invite_url;
  }
}

export async function fetchLeadershipIds() {
  const res = await handleApiRequest('GET', '/api/kv/leaders');
  if (!res.ok) {
    return { presidentId: '', vicePresidentId: '' };
  }
  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }
  let parsed = {};
  if (payload && typeof payload.value === 'string') {
    try {
      parsed = JSON.parse(payload.value || '{}');
    } catch {
      parsed = {};
    }
  }
  const presidentId = typeof parsed.president_id === 'string' ? parsed.president_id : '';
  const vicePresidentId =
    typeof parsed.vice_president_id === 'string' ? parsed.vice_president_id : '';
  return { presidentId, vicePresidentId };
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
