import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  const appJwt = session?.backendJwt || null;
  const hdrs = {};
  if (appJwt) hdrs['x-jwt'] = appJwt;

  const resolvedParams = await params;
  const name = normalizeName(resolvedParams?.name);
  const formData = await request.formData();
  const res = await fetch(
    `${process.env.BACKEND_URL || ''}/api/executive/w/${encodePathValue(name)}/update`,
    {
      method: 'POST',
      headers: hdrs,
      body: formData,
      cache: 'no-store',
    },
  );
  return res;
}

function normalizeName(name) {
  if (Array.isArray(name)) return name.join('/');
  return name || '';
}

function encodePathValue(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}
