import { cookies } from 'next/headers';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';

export async function POST(request, { params }) {
  const cookieStore = cookies();
  const appJwt = cookieStore.get('app_jwt')?.value || null;
  const formData = await request.formData();
  const res = await fetch(`${getBaseUrl()}/api/executive/w/${params['name']}/update`, {
    method: 'POST',
    headers: { 'x-api-secret': getApiSecret(), 'x-jwt': appJwt },
    body: formData,
    cache: 'no-store',
  });
  return res;
}
