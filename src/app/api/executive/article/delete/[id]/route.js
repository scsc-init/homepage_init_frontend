import { handleApiRequest } from '@/app/api/apiWrapper';

export async function POST(request, { params }) {
  return handleApiRequest('POST', '/api/executive/article/delete/{id}', {
    params,
  });
}
