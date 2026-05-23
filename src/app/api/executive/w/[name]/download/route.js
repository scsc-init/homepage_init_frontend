import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';
import { fetchBackendServer } from '@/util/fetch/server';

export async function GET(_, { params }) {
  const session = await getServerSession(authOptions);
  const appJwt = session?.backendJwt || null;
  if (!appJwt) {
    return Response.json({ detail: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetchBackendServer(
    'GET',
    `/api/executive/w/${encodeURIComponent(params['name'])}/download`,
  );

  const blob = await res.blob();
  return new Response(blob, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'text/html',
      'Content-Disposition':
        res.headers.get('Content-Disposition') || `attachment; filename="${params.name}.html"`,
    },
  });
}
