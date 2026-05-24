import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';

export async function GET(_, { params }) {
  const session = await getServerSession(authOptions);
  const appJwt = session?.backendJwt || null;
  if (!appJwt) {
    return Response.json({ detail: 'Unauthorized' }, { status: 401 });
  }

  const name = normalizeName(params?.name);
  const hdrs = {};
  hdrs['x-jwt'] = appJwt;

  const res = await fetch(
    `${process.env.BACKEND_URL || ''}/api/executive/w/${encodePathValue(name)}/download`,
    {
      method: 'GET',
      headers: hdrs,
      cache: 'no-store',
    },
  );

  const blob = await res.blob();
  return new Response(blob, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'text/html',
      'Content-Disposition':
        res.headers.get('Content-Disposition') ||
        `attachment; filename="${name.replaceAll('/', '__')}.html"`,
    },
  });
}

function normalizeName(name) {
  if (Array.isArray(name)) return name.join('/');
  return name || '';
}

function encodePathValue(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}
