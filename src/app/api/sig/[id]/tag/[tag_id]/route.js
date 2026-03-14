import { handleApiRequest } from '@/app/api/apiWrapper';

export async function DELETE(_request, { params }) {
  return handleApiRequest('DELETE', `/api/sig/${params.id}/tag/${params.tag_id}`);
}
