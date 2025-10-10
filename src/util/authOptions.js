import { cookies } from 'next/headers';
import Google from 'next-auth/providers/google';
import crypto from 'crypto';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';
import * as validator from '@/util/validator';

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
      if (!user?.email || !user?.name) {
        return '/us/login?error=no_information';
      }

      if (process.env.SNU_EMAIL_CHECK === 'TRUE' && !validator.email(user.email)) {
        return '/us/login?error=invalid_email';
      }

      let res;
      const apiSecret = getApiSecret();
      if (!apiSecret) {
        console.error('API_SECRET is missing');
        return '/us/login?error=default';
      }
      const hash = crypto
        .createHmac('sha256', apiSecret)
        .update(String(user.email).toLowerCase())
        .digest('hex');
      try {
        res = await fetch(`${getBaseUrl()}/api/user/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-secret': getApiSecret() },
          body: JSON.stringify({
            hashToken: hash,
            email: user.email,
          }),
          cache: 'no-store',
        });
      } catch (err) {
        console.error('Backend login request failed:', err);
        return '/us/login?error=default';
      }

      if (res.status === 200) {
        let data;
        try {
          data = await res.json();
        } catch (error) {
          console.error('Failed to parse login response:', error);
          return '/us/login?error=default';
        }

        if (!data.jwt) {
          console.error('JWT missing in login response');
          return '/us/login?error=default';
        }

        cookies().set('app_jwt', data.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });

        user.registered = true;
        user.hashToken = hash;

        return true;
      }

      if (res.status === 404) {
        return true;
      }

      return '/us/login?error=default';
    },
    async jwt({ token, user }) {
      if (user) {
        token.registered = user.registered || false;
        token.hashToken = user.hashToken || null;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.registered = token.registered || false;
        session.hashToken = token.hashToken || null;
      }
      return session;
    },
  },
  pages: { signIn: '/us/login' },
  events: {},
};
