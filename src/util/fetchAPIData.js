import { handleApiRequest } from '@/app/api/apiWrapper';

export async function fetchUser() {
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
  const pigsWithContent = await Promise.all(
    pigsRaw.map(async (pig) => {
      const articleRes = await handleApiRequest('GET', `/api/article/${pig.content_id}`);
      const article = articleRes.ok ? await articleRes.json() : { content: '' };
      return { ...pig, content: article.content };
    }),
  );
  return pigsWithContent;
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
