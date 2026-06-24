import { fetchBackendServer } from '@/util/fetch/server';

export async function POST(req) {
  const formData = await req.formData();

  const res = await fetchBackendServer('POST', '/api/file/image/upload', {
    body: formData,
  });

  const text = await res.text().catch(() => '');

  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  return new Response(data ? JSON.stringify(data) : text, {
    status: res.status,
    headers: data ? { 'Content-Type': 'application/json' } : {},
  });
}
