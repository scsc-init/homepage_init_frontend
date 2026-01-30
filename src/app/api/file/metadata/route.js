import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  const pathWithQuery = `/api/file/metadata?${qs}`;
  return handleApiRequest('GET', pathWithQuery);
}
