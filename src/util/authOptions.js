import Google from 'next-auth/providers/google';
import { cookies } from 'next/headers';

export const authOptions = {
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: { signIn: '/us/login' },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === 'google' && token?.email) {
        try {
          const res = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: token.email }),
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
            token.signupRequired = false;
          } else if (res.status === 404) {
            token.signupRequired = true;
          }
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      session.signupRequired = Boolean(token?.signupRequired);
      return session;
    },
  },
  events: {},
};
