import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { authOptions } from '@/util/authOptions';
import { isLegacySessionCookie, shareAuthCookies } from '@/util/authCookies';

const nextAuthHandler = NextAuth(authOptions);

async function handler(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> },
) {
  const response: Response = await nextAuthHandler(request, context);

  if (shareAuthCookies) {
    // NextAuth reads only the new cookie namespace, so legacy values cannot affect
    // this request. Expire the old cookies for subsequent requests as well.
    for (const { name } of request.cookies.getAll()) {
      if (!isLegacySessionCookie(name)) continue;
      const secure = name.startsWith('__Secure-');
      const attributes = `Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
      response.headers.append('Set-Cookie', `${name}=; ${attributes}`);
      if (secure) {
        response.headers.append('Set-Cookie', `${name}=; ${attributes}; Domain=.scsc.dev`);
      }
    }
  }

  return response;
}

export { handler as GET, handler as POST };
