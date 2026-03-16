import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET(request) {
  return handleApiRequest('GET', '/api/executive/users/summary', {}, request);
}
