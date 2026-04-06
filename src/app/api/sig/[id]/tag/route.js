import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET(_request, { params }) {
  return handleApiRequest('GET', '/api/sig/{id}/tag', { params });
}

export async function POST(request, { params }) {
  return handleApiRequest('POST', '/api/sig/{id}/tag', { params }, request);
}
