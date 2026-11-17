import { fetchBackendServer } from '@/util/fetch/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const res = await fetchBackendServer('POST', '/api/file/docs/upload', {
      body: formData,
    });

    const status = res.status;
    const contentType = res.headers.get('Content-Type') || 'application/json';
    const text = await res.text();

    return new Response(text, {
      status,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    console.error('Upload Route Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
