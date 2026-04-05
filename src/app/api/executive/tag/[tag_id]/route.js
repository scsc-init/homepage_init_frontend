import { handleApiRequest } from '@/app/api/apiWrapper';

export async function DELETE(_request, { params }) {
  return handleApiRequest('DELETE', '/api/executive/tag/{tag_id}', { params });
}
