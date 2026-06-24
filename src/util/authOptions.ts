import crypto from 'crypto';
import type { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import * as validator from '@/util/validator';
import type { UserProfile } from '@/types/user';
import { fetchBackendServer } from '@/util/fetch/server';

interface LoginResponseBody {
  jwt?: string;
}

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
const apiSecret = process.env.API_SECRET ?? '';
const DEFAULT_JWT_VALID_SECONDS = 12 * 60 * 60;
const parseJwtValidSeconds = (value?: string) => {
  if (!value?.trim()) {
    return DEFAULT_JWT_VALID_SECONDS;
  }

  const seconds = Number(value);

  if (!Number.isInteger(seconds) || seconds <= 0) {
    return DEFAULT_JWT_VALID_SECONDS;
  }

  return seconds;
};

const jwtValidSeconds = parseJwtValidSeconds(process.env.JWT_VALID_SECONDS);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: jwtValidSeconds,
  },
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      ...(process.env.SNU_EMAIL_CHECK === 'TRUE' && {
        authorization: {
          params: { hd: 'snu.ac.kr' },
        },
      }),
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
        res = await fetchBackendServer('POST', '/api/user/login', {
          skipSession: true,
          headers: { 'Content-Type': 'application/json', 'x-api-secret': apiSecret },
          body: {
            hashToken: hash,
            email: user.email,
          },
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
        try {
          const profileRes = await fetchBackendServer('GET', '/api/user/profile', {
            skipSession: true,
            headers: {
              'x-jwt': data.jwt,
              'x-api-secret': apiSecret,
            },
          });

          if (profileRes.ok) {
            user.userProfile = (await profileRes.json()) as UserProfile;
            user.userProfileCachedAt = Date.now();
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
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
        if (user.userProfile) {
          token.userProfile = user.userProfile;
          token.userProfileCachedAt = user.userProfileCachedAt ?? Date.now();
        } else {
          delete token.userProfile;
          delete token.userProfileCachedAt;
        }
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

      if (trigger === 'update' && session?.userProfile) {
        token.userProfile = session.userProfile;
        token.userProfileCachedAt = Date.now();
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

      if (token.userProfile) {
        session.userProfile = token.userProfile;
      } else {
        delete session.userProfile;
      }
      if (token.userProfileCachedAt) {
        session.userProfileCachedAt = token.userProfileCachedAt;
      } else {
        delete session.userProfileCachedAt;
      }
      return session;
    },
  },
  pages: { signIn: '/us/login' },
  events: {},
};
