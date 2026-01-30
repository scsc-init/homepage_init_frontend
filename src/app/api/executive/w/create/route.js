import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';
import { getBaseUrl } from '@/util/getBaseUrl';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const appJwt = session?.backendJwt || null;
  const hdrs = {};
  if (appJwt) hdrs['x-jwt'] = appJwt;

  const formData = await request.formData();
  const res = await fetch(`${getBaseUrl()}/api/executive/w/create`, {
    method: 'POST',
    headers: hdrs,
    body: formData,
    cache: 'no-store',
  });
  return res;
}
