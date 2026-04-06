import crypto from 'crypto';
import type { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import * as validator from '@/util/validator';

interface LoginResponseBody {
  jwt?: string;
}

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
const backendUrl = process.env.BACKEND_URL ?? '';
const apiSecret = process.env.API_SECRET ?? '';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 10 * 24 * 60 * 60,
  },
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email || !user.name) {
        return '/us/login?error=no_information';
      }

      if (process.env.SNU_EMAIL_CHECK === 'TRUE' && !validator.email(user.email)) {
        return '/us/login?error=invalid_email';
      }

      if (!apiSecret) {
        console.error('API_SECRET is missing');
        return '/us/login?error=default';
      }

      const hash = crypto
        .createHmac('sha256', apiSecret)
        .update(user.email.toLowerCase())
        .digest('hex');

      let res: Response;
      try {
        res = await fetch(`${backendUrl}/api/user/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-secret': apiSecret },
          body: JSON.stringify({
            hashToken: hash,
            email: user.email,
          }),
          cache: 'no-store',
        });
      } catch (err: unknown) {
        console.error('Backend login request failed:', err);
        return '/us/login?error=default';
      }

      if (res.status === 200) {
        let data: LoginResponseBody;
        try {
          data = (await res.json()) as LoginResponseBody;
        } catch (error: unknown) {
          console.error('Failed to parse login response:', error);
          return '/us/login?error=default';
        }

        if (!data.jwt) {
          console.error('JWT missing in login response');
          return '/us/login?error=default';
        }

        user.backendJwt = data.jwt;
        user.registered = true;
        user.hashToken = hash;

        return true;
      }

      if (res.status === 404) {
        user.hashToken = hash;
        return true;
      }

      return '/us/login?error=default';
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        if (user.backendJwt) {
          token.backendJwt = user.backendJwt;
        } else {
          delete token.backendJwt;
        }

        token.registered = user.registered ?? false;

        if (user.hashToken) {
          token.hashToken = user.hashToken;
        } else {
          delete token.hashToken;
        }
      }

      if (trigger === 'update' && session?.backendJwt) {
        token.backendJwt = session.backendJwt;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.backendJwt) {
        session.backendJwt = token.backendJwt;
      } else {
        delete session.backendJwt;
      }

      session.registered = token.registered ?? false;

      if (token.hashToken) {
        session.hashToken = token.hashToken;
      } else {
        delete session.hashToken;
      }

      return session;
    },
  },
  pages: { signIn: '/us/login' },
  events: {},
};
