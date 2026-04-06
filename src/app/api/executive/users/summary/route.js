import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());

  return handleApiRequest('GET', '/api/executive/users/summary', { query });
}
