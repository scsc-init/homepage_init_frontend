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
      // 최초 Google 로그인 시 BE 로그인 시도 → 기존회원이면 appJwt 발급, 미가입이면 signupRequired=true
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
          // BE 연결 실패 시 그대로 두고, 클라에서 가입 플로우 진행
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

// v4면 함수, v5면 객체가 반환됨
const nextAuthReturn = NextAuth(authConfig);

// v5 감지
const isV5 =
  typeof nextAuthReturn === "object" &&
  nextAuthReturn !== null &&
  "handlers" in nextAuthReturn &&
  nextAuthReturn.handlers &&
  typeof nextAuthReturn.handlers.GET === "function" &&
  typeof nextAuthReturn.handlers.POST === "function";

// v5라면 그대로 노출
export const handlers = isV5 ? nextAuthReturn.handlers : undefined;
export const auth = isV5 ? nextAuthReturn.auth : undefined;
export const signIn = isV5 ? nextAuthReturn.signIn : undefined;
export const signOut = isV5 ? nextAuthReturn.signOut : undefined;

// 공통 진입점: 라우트에서 바로 재노출할 수 있게 GET/POST 보장
export const GET = isV5 ? nextAuthReturn.handlers.GET : nextAuthReturn;   // v4는 handler 함수
export const POST = isV5 ? nextAuthReturn.handlers.POST : nextAuthReturn; // v4는 handler 함수
