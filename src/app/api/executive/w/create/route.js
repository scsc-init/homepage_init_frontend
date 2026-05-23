import { fetchBackendServer } from '@/util/fetch/server';

export async function POST(request) {
  const formData = await request.formData();
  const res = await fetchBackendServer('POST', '/api/executive/w/create', {
    body: formData,
  });
  return res;
}
