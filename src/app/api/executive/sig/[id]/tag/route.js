import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET(request, { params }) {
  return handleApiRequest('GET', '/api/sig/{id}/tag', { params }, request);
}

export async function POST(request, { params }) {
  return handleApiRequest('POST', '/api/sig/{id}/tag', { params }, request);
}
