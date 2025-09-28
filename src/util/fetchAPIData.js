import { getApiSecret } from '@/util/getApiSecret';
import { getBaseUrl } from '@/util/getBaseUrl';

export async function fetchBoards(targetBoardIds) {
  const boardResults = await Promise.all(
    targetBoardIds.map(async (id) => {
      const res = await fetch(`${getBaseUrl()}/api/board/${id}`, {
        headers: { 'x-api-secret': getApiSecret() },
        cache: 'no-store',
      });
      return res.ok ? await res.json() : null;
    }),
  );
  return boardResults.filter(Boolean);
}

export async function fetchSigs() {
  const res = await fetch(`${getBaseUrl()}/api/sigs`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  if (!res.ok) return;
  const sigsRaw = await res.json();
  const sigsWithContent = await Promise.all(
    sigsRaw.map(async (sig) => {
      const articleRes = await fetch(`${getBaseUrl()}/api/article/${sig.content_id}`, {
        headers: { 'x-api-secret': getApiSecret() },
        cache: 'no-store',
      });
      const article = articleRes.ok ? await articleRes.json() : { content: '' };
      return { ...sig, content: article.content };
    }),
  );
  return sigsWithContent;
}

export async function fetchPigs() {
  const res = await fetch(`${getBaseUrl()}/api/pigs`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  if (!res.ok) return;
  const pigsRaw = await res.json();
  const pigsWithContent = await Promise.all(
    pigsRaw.map(async (pig) => {
      const articleRes = await fetch(`${getBaseUrl()}/api/article/${pig.content_id}`, {
        headers: { 'x-api-secret': getApiSecret() },
        cache: 'no-store',
      });
      const article = articleRes.ok ? await articleRes.json() : { content: '' };
      return { ...pig, content: article.content };
    }),
  );
  return pigsWithContent;
}

export async function fetchScscGlobalStatus() {
  const res = await fetch(`${getBaseUrl()}/api/scsc/global/status`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  return res.ok ? await res.json() : '';
}

export async function fetchMajors() {
  const res = await fetch(`${getBaseUrl()}/api/majors`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  if (res.ok) return await res.json();
}

export async function fetchDiscordBotStatus() {
  const res = await fetch(`${getBaseUrl()}/api/bot/discord/status`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  if (res.ok) return await res.json();
}

export async function fetchSCSCGlobalStatus() {
  const res = await fetch(`${getBaseUrl()}/api/scsc/global/status`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  return res.ok ? await res.json() : null;
}

export async function fetchDiscordInviteLink() {
  const res = await fetch(`${getBaseUrl()}/api/bot/discord/general/get_invite`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  if (res.ok) {
    const resData = await res.json();
    return resData.result.invite_url;
  }
}
