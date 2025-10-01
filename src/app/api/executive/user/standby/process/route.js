export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';

export async function POST(request) {
  const cookieStore = cookies();
  const jwt = cookieStore.get('app_jwt')?.value || '';

  const formData = await request.formData();

  const res = await fetch(`${getBaseUrl()}/api/executive/user/standby/process`, {
    method: 'POST',
    headers: {
      'x-api-secret': getApiSecret(),
      ...(jwt ? { 'x-jwt': jwt, Authorization: `Bearer ${jwt}` } : {}),
    },
    body: formData,
    cache: 'no-store',
  });

  return res;
}
