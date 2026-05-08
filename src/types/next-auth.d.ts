// src/types/next-auth.d.ts

import type { DefaultSession, DefaultUser } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string;
  }

  interface User extends DefaultUser {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string;
  }
}
