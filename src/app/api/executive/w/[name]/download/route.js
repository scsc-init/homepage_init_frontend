import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';

export async function GET(_, { params }) {
  const session = await getServerSession(authOptions);
  const appJwt = session?.backendJwt || null;

  const hdrs = {};
  if (appJwt) hdrs['x-jwt'] = appJwt;

  const res = await fetch(
    `${process.env.BACKEND_URL || ''}/api/executive/w/${encodeURIComponent(
      params['name'],
    )}/download`,
    {
      method: 'GET',
      headers: hdrs,
      cache: 'no-store',
    },
  );

  return res;
}
