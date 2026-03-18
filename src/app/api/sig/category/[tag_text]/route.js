import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());
  return handleApiRequest('GET', '/api/sig/category/{tag_text}', { params, query });
}
