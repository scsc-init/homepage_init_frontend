import { getApiSecret } from '@/util/getApiSecret';
import { getBaseUrl } from '@/util/getBaseUrl';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/w/${encodeURIComponent(params?.slug ?? '')}`, {
      headers: { 'x-api-secret': getApiSecret() },
      cache: 'no-store',
    });
    if (!res.ok) {
      return await notFoundPage();
    }
    const html = await res.text();
    return new Response(html, {
      status: res.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch {
    return await notFoundPage();
  }
}

async function notFoundPage() {
  const filePath = path.join(process.cwd(), 'public', 'not-found.html');
  const html = await fs.readFile(filePath, 'utf-8');
  return new Response(html, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
