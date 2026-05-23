import { promises as fs } from 'fs';
import path from 'path';
import { fetchBackendServer } from '@/util/fetch/server';

export async function GET(_, { params }) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams?.slug) {
      return await notFoundPage();
    }
    const res = await fetchBackendServer(
      'GET',
      `/api/w/${encodeURIComponent(resolvedParams.slug)}`,
    );
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
