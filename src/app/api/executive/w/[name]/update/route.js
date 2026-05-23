import { fetchBackendServer } from '@/util/fetch/server';

export async function POST(request, { params }) {
  const formData = await request.formData();
  const res = await fetchBackendServer(
    'POST',
    `/api/executive/w/${encodeURIComponent(params['name'])}/update`,
    { body: formData },
  );
  return res;
}
