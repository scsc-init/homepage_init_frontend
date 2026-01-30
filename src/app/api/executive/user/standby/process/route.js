export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';
import { getBaseUrl } from '@/util/getBaseUrl';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const jwt = session?.backendJwt || null;

  const formData = await request.formData();

  const res = await fetch(`${getBaseUrl()}/api/executive/user/standby/process`, {
    method: 'POST',
    headers: {
      ...(jwt ? { 'x-jwt': jwt } : {}),
    },
    body: formData,
    cache: 'no-store',
  });

  return res;
}
