import { handleApiRequest } from '@/app/api/apiWrapper';
import { ENABLE_TEST_UTILS } from '@/util/constants';

export async function POST(request) {
  if (!ENABLE_TEST_UTILS) return new Response(null, { status: 404 });
  return handleApiRequest('POST', '/api/test/users', {}, request);
}

export async function DELETE() {
  if (!ENABLE_TEST_UTILS) return new Response(null, { status: 404 });
  return handleApiRequest('DELETE', '/api/test/users');
}
