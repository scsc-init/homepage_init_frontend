import { handleApiRequest } from '@/util/serverFetch';

export async function GET(_request, { params }) {
  const { id } = await params;
  return handleApiRequest('GET', `/api/sig/${id}/tag`);
}

export async function POST(request, { params }) {
  const { id } = await params;
  return handleApiRequest('POST', `/api/sig/${id}/tag`, {}, request);
}
