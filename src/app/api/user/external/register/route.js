import { fetchBackendServer } from '@/util/fetch/server';

export async function POST(request) {
  return fetchBackendServer('POST', '/api/user/external/register', {}, request);
}
