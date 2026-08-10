import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const id = encodeURIComponent(resolvedParams.id);
  const targetUrl = new URL(`/api/file/image/download/${id}`, request.url);

  return NextResponse.redirect(targetUrl, 307);
}
