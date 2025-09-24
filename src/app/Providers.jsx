//
/**
 *로그인에서 nextauth 정책 준수를 위해 session을 사용합니다.
 */
'use client';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
