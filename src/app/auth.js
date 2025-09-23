import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ABS_BASE =
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const authConfig = {
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
          const res = await fetch(`${ABS_BASE}/api/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: token.email }),
            cache: "no-store",
          });
          if (res.status === 200) {
            const data = await res.json();
            token.appJwt = data?.jwt;
            token.signupRequired = false;
          } else if (res.status === 404) {
            token.signupRequired = true;
          }
        } catch {
          
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.appJwt) session.appJwt = token.appJwt;
      session.signupRequired = Boolean(token?.signupRequired);
      return session;
    },
  },
};

const nextAuthReturn = NextAuth(authConfig);
// package.json에서 v4로 명시했지만, 무언가 꼬이는 현상이 있어 nextauth v5 대응 코드를 남겼습니다.
const isV5 =
  typeof nextAuthReturn === "object" &&
  nextAuthReturn !== null &&
  "handlers" in nextAuthReturn &&
  nextAuthReturn.handlers &&
  typeof nextAuthReturn.handlers.GET === "function" &&
  typeof nextAuthReturn.handlers.POST === "function";


export const handlers = isV5 ? nextAuthReturn.handlers : undefined;
export const auth = isV5 ? nextAuthReturn.auth : undefined;
export const signIn = isV5 ? nextAuthReturn.signIn : undefined;
export const signOut = isV5 ? nextAuthReturn.signOut : undefined;


export const GET = isV5 ? nextAuthReturn.handlers.GET : nextAuthReturn;
export const POST = isV5 ? nextAuthReturn.handlers.POST : nextAuthReturn;
