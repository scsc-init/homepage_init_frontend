import { handleApiRequest } from '@/app/api/apiWrapper';

export async function POST(request) {
  return handleApiRequest('POST', '/api/file/metadata', {}, request);
}
