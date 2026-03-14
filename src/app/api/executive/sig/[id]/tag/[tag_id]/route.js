import { handleApiRequest } from '@/app/api/apiWrapper';

export async function DELETE(request, { params }) {
  return handleApiRequest('DELETE', '/api/sig/{id}/tag/{tag_id}', { params }, request);
}
