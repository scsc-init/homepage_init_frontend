import { promises as fs } from 'fs';
import path from 'path';
import { fetchBackendServer } from '@/util/fetch/server';
import { routing } from '@/i18n/routing';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  try {
    const resolvedParams = await params;
    const slug = normalizeSlug(resolvedParams?.slug);
    if (!slug) {
      return await notFoundPage(request);
    }

    const res = await fetchBackendServer('GET', `/api/w/${encodePathValue(slug)}`, {
      headers: {
        'X-Forwarded-User-Agent': request.headers.get('user-agent') ?? '',
        'X-Forwarded-Sec-Fetch-Mode': request.headers.get('sec-fetch-mode') ?? '',
      },
    });

    if (!res.ok) {
      return await notFoundPage(request);
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
    return await notFoundPage(request);
  }
}

async function notFoundPage(request: Request) {
  const locale = getRequestLocale(request);
  const fileName = locale === 'ko-KR' ? 'not-found.html' : `not-found.${locale}.html`;
  const filePath = path.join(process.cwd(), 'public', fileName);
  let html;
  try {
    html = await fs.readFile(filePath, 'utf-8');
  } catch {
    const titles = {
      'ko-KR': '페이지를 찾을 수 없습니다.',
      'en-US': 'Page not found',
      'ru-RU': 'Страница не найдена',
    };
    html = `<!doctype html><html lang="${locale}"><meta charset="utf-8"><title>404</title><h1>${titles[locale]}</h1>`;
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

function getRequestLocale(request: Request) {
  const host = (
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    ''
  ).toLowerCase();
  return (
    routing.domains?.find((domain) => domain.domain.toLowerCase() === host)?.defaultLocale ??
    routing.defaultLocale
  );
}

function normalizeSlug(slug: string | string[] | undefined) {
  if (Array.isArray(slug)) return slug.join('/');
  return slug || '';
}

function encodePathValue(value: string) {
  return value.split('/').map(encodeURIComponent).join('/');
}
