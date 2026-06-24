import { promises as fs } from 'fs';
import path from 'path';
import { fetchBackendServer } from '@/util/fetch/server';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const slug = normalizeSlug(resolvedParams?.slug);
    if (!slug) {
      return await notFoundPage();
    }

    const res = await fetchBackendServer('GET', `/api/w/${encodePathValue(slug)}`, {
      headers: {
        'X-Forwarded-User-Agent': request.headers.get('user-agent') ?? '',
        'X-Forwarded-Sec-Fetch-Mode': request.headers.get('sec-fetch-mode') ?? '',
      },
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

function normalizeSlug(slug) {
  if (Array.isArray(slug)) return slug.join('/');
  return slug || '';
}

function encodePathValue(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}
