import { cookies } from 'next/headers';
import Google from 'next-auth/providers/google';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';

function validate(email) {
  if (process.env.SNU_EMAIL_CHECK === 'TRUE')
    return email != undefined && /^[a-zA-Z0-9._%+-]+@snu.ac.kr$/.test(email);
  return true;
}

export const authOptions = {
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user || !user.email || !user.name) {
        return '/us/login?error=no_information';
      }

      if (!validate(user.email)) {
        return '/us/login?error=invalid_email';
      }

      const res = await fetch(`${getBaseUrl()}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-secret': getApiSecret() },
        body: JSON.stringify({
          email: user.email,
        }),
        cache: 'no-store',
      });

      if (res.status === 200) {
        const data = await res.json();

        cookies().set('app_jwt', data.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });

        return true;
      }

      if (res.status === 404) {
        return true;
      }

      return '/us/login?error=default';
    },
  },
  pages: { signIn: '/us/login' },
  events: {},
};
