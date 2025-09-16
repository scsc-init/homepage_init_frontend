import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { prompt: "select_account" },
      },
    }),
  ],
  pages: { signIn: "/us/login" },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "google" && token?.email) {
        console.log(
          JSON.stringify({
            type: "auth_flow",
            step: "jwt_start",
            email: token.email,
            provider: account.provider,
            ts: new Date().toISOString(),
          }),
        );
        try {
          const base = (process.env.NEXTAUTH_URL || "")
            .replace(/\/+$/, "")
            .trim();
          const url = base ? `${base}/api/user/login` : "/api/user/login";
          const ac = new AbortController();
          const timeout = setTimeout(() => ac.abort(), 10_000);
          try {
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: String(token.email).toLowerCase(),
              }),
              cache: "no-store",
              signal: ac.signal,
            });

            if (res.status === 200) {
              const data = await res.json();
              token.appJwt = data.jwt;
              token.signupRequired = false;
              console.log(
                JSON.stringify({
                  type: "auth_flow",
                  step: "jwt_existing_user",
                  email: token.email,
                  status: 200,
                  ts: new Date().toISOString(),
                }),
              );
            } else if (res.status === 404) {
              token.signupRequired = true;
              console.log(
                JSON.stringify({
                  type: "auth_flow",
                  step: "jwt_need_signup",
                  email: token.email,
                  status: 404,
                  ts: new Date().toISOString(),
                }),
              );
            } else {
              token.loginError = true;
              console.log(
                JSON.stringify({
                  type: "auth_flow",
                  step: "jwt_backend_error",
                  email: token.email,
                  status: res.status,
                  ts: new Date().toISOString(),
                }),
              );
            }
          } finally {
            clearTimeout(timeout);
          }
        } catch (e) {
          token.loginError = true;
          console.error(
            JSON.stringify({
              type: "auth_flow",
              step: "jwt_fetch_failed",
              email: token.email,
              error: String(e),
              ts: new Date().toISOString(),
            }),
          );
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.appJwt) session.appJwt = token.appJwt;
      session.signupRequired = Boolean(token?.signupRequired);
      session.loginError = Boolean(token?.loginError);
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(
        JSON.stringify({
          type: "auth_event",
          event: "signIn",
          email: user?.email || null,
          provider: account?.provider || null,
          isNewUser: Boolean(isNewUser),
          ts: new Date().toISOString(),
        }),
      );
    },
    async signOut({ session }) {
      console.log(
        JSON.stringify({
          type: "auth_event",
          event: "signOut",
          email: session?.user?.email || null,
          ts: new Date().toISOString(),
        }),
      );
    },
    async session({ session }) {
      console.log(
        JSON.stringify({
          type: "auth_event",
          event: "session",
          email: session?.user?.email || null,
          signupRequired: Boolean(session?.signupRequired),
          hasAppJwt: Boolean(session?.appJwt),
          ts: new Date().toISOString(),
        }),
      );
    },
    async error(message) {
      console.error(
        JSON.stringify({
          type: "auth_event",
          event: "error",
          message: String(message),
          ts: new Date().toISOString(),
        }),
      );
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
