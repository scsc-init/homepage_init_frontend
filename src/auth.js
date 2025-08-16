import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: { signIn: "/us/login" },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "google" && token?.email) {
        try {
          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/user/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: token.email }),
            },
          );
          if (res.status === 200) {
            const data = await res.json();
            token.appJwt = data.jwt;
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
});
