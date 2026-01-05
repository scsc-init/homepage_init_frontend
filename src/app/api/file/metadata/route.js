import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  const pathWithQuery = qs ? `/api/file/metadata?${qs}` : '/api/file/metadata';
  return handleApiRequest('GET', pathWithQuery);
}
