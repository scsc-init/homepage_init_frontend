import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';

export async function POST(req) {
  const base = process.env.BACKEND_URL || '';
  const url = `${base}/api/file/docs/upload`;

  try {
    const session = await getServerSession(authOptions);
    const appJwt = session?.backendJwt || null;

    const formData = await req.formData();

    const headers = {
      ...(appJwt ? { 'x-jwt': appJwt } : {}),
    };

    const res = await fetch(url, {
      method: 'POST',
      headers,
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
      JSON.stringify({ error: 'Internal Server Error', message: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
