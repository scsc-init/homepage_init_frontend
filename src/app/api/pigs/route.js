import { NextResponse } from 'next/server';
import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET(request) {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());

  const softFetch = async (path) => {
    try {
      const res = await handleApiRequest('GET', path);
      if (!res.ok) return null;
      return await res.json().catch(() => null);
    } catch {
      return null;
    }
  };

  const pigsRes = await handleApiRequest('GET', '/api/pigs', { query });
  if (!pigsRes.ok) return pigsRes;

  const pigsRaw = await pigsRes.json().catch(() => []);

  const pigsWithExtras = await Promise.all(
    (Array.isArray(pigsRaw) ? pigsRaw : []).map(async (pig) => {
      const [article, members] = await Promise.all([
        softFetch(`/api/article/${pig.content_id}`),
        softFetch(`/api/pig/${pig.id}/members`),
      ]);

      return {
        ...pig,
        content: article?.content ?? '',
        members: Array.isArray(members) ? members : [],
      };
    }),
  );

  return NextResponse.json(pigsWithExtras);
}
