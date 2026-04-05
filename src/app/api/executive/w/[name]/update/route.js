import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  const appJwt = session?.backendJwt || null;
  const hdrs = {};
  if (appJwt) hdrs['x-jwt'] = appJwt;

  const formData = await request.formData();
  const res = await fetch(
    `${process.env.BACKEND_URL || ''}/api/executive/w/${encodeURIComponent(params['name'])}/update`,
    {
      method: 'POST',
      headers: hdrs,
      body: formData,
      cache: 'no-store',
    },
  );
  return res;
}
