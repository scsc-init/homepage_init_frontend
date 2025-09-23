import Google from 'next-auth/providers/google';

const ABS_BASE =
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

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
          const res = await fetch(`${ABS_BASE}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: token.email }),
            cache: 'no-store',
          });
          if (res.status === 200) {
            const data = await res.json();
            token.appJwt = data?.jwt;
            token.signupRequired = false;
          } else if (res.status === 404) {
            token.signupRequired = true;
          }
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.appJwt) session.appJwt = token.appJwt;
      session.signupRequired = Boolean(token?.signupRequired);
      return session;
    },
  },
  events: {
    async signOut() {
      try {
        await fetch(`${ABS_BASE}/api/auth/app-jwt`, { method: 'DELETE', cache: 'no-store' });
      } catch {}
    },
  },
};
