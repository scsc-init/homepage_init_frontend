import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET(request) {
  const url = new URL(request.url);
  const queryString = url.search; // "?q=key1&q=key2" 그대로
  return handleApiRequest('GET', `/api/kvs${queryString}`);
}
