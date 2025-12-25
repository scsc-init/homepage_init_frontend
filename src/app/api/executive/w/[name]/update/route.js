import { cookies } from 'next/headers';
import { getBaseUrl } from '@/util/getBaseUrl';

export async function POST(request, { params }) {
  const cookieStore = cookies();
  const appJwt = cookieStore.get('app_jwt')?.value || null;
  const hdrs = {};
  if (appJwt) hdrs['x-jwt'] = appJwt;

  const formData = await request.formData();
  const res = await fetch(
    `${getBaseUrl()}/api/executive/w/${encodeURIComponent(params['name'])}/update`,
    {
      method: 'POST',
      headers: hdrs,
      body: formData,
      cache: 'no-store',
    },
  );
  return res;
}
