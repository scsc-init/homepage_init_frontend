import { handleApiRequest } from '@/app/api/apiWrapper';

export async function POST(_, { params }) {
  return handleApiRequest('POST', '/api/executive/w/{name}/delete', { params });
}
