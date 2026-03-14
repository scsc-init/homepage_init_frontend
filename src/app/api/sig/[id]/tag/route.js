import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET(_request, { params }) {
  return handleApiRequest('GET', `/api/sig/${params.id}/tag`);
}

export async function POST(request, { params }) {
  return handleApiRequest('POST', `/api/sig/${params.id}/tag`, {}, request);
}
