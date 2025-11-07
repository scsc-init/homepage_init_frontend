import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET(request) {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());
  return handleApiRequest('GET', '/api/users', { query });
}
