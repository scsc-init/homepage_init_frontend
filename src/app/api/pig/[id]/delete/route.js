import { handleApiRequest } from '@/app/api/apiWrapper';

export async function POST(request, { params }) {
  return handleApiRequest('POST', '/api/pig/{id}/delete', { params });
}
