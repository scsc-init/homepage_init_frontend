import { handleApiRequest } from '@/util/serverFetch';

export async function DELETE(_request, { params }) {
  const { id, tag_id } = await params;
  return handleApiRequest('DELETE', `/api/sig/${id}/tag/${tag_id}`);
}
