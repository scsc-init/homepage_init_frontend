import { fetchBackendServer } from '@/util/fetch/server';

export async function GET(_, { params }) {
  const resolvedParams = await params;
  const name = normalizeName(resolvedParams?.name);

  const res = await fetchBackendServer(
    'GET',
    `/api/executive/w/${encodePathValue(name)}/download`,
  );

  if (res.status === 401) {
    return Response.json({ detail: 'Unauthorized' }, { status: 401 });
  }

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
