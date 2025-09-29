import { getApiSecret } from '@/util/getApiSecret';
import { getBaseUrl } from '@/util/getBaseUrl';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(_, { params }) {
  try {
    if (!params?.slug) {
      return await notFoundPage();
    }
    const res = await fetch(`${getBaseUrl()}/api/w/${encodeURIComponent(params.slug)}`, {
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
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return await notFoundPage();
  }
}

async function notFoundPage() {
  const filePath = path.join(process.cwd(), 'public', 'not-found.html');
  let html;
  try {
    html = await fs.readFile(filePath, 'utf-8');
  } catch {
    html =
      '<!doctype html><html lang="ko"><meta charset="utf-8"><title>404</title><h1>페이지를 찾을 수 없습니다.</h1>';
  }
  return new Response(html, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
