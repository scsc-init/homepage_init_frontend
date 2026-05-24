import { handleApiRequest } from '@/app/api/apiWrapper';

export async function POST(request, { params }) {
  const user_agent = request.headers.get('user-agent');
  const hdrs = { 'X-Forwarded-User-Agent': user_agent };
  return fetch(
    `${process.env.BACKEND_URL || ''}/api/w/${encodeURIComponent(params.slug)}/view`,
    {
      method: 'POST',
      headers: hdrs,
      cache: 'no-store',
    },
  );
}
