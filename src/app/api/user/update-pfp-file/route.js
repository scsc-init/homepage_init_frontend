export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { fetchBackendServer } from '@/util/fetch/server';

export async function POST(request) {
  const formData = await request.formData();

  const res = await fetchBackendServer('POST', '/api/user/update-pfp-file', {
    body: formData,
  });

  return res;
}
