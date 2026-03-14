import { handleApiRequest } from '@/util/serverFetch';

export async function DELETE(_request, { params }) {
  const { tag_id } = await params;
  return handleApiRequest('DELETE', `/api/executive/tag/${tag_id}`);
}
