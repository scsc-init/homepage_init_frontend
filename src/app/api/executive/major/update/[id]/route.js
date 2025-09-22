import { handleApiRequest } from '@/app/api/apiWrapper';

export async function POST(request, { params }) {
  return handleApiRequest('POST', '/api/executive/major/update/{id}', { params }, request);
}
