// src/types/next-auth.d.ts

import type { DefaultSession, DefaultUser } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';
import type { UserProfile } from '@/types/user';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string;
    userProfile?: UserProfile;
    userProfileCachedAt?: number;
  }

  interface User extends DefaultUser {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string;
    userProfile?: UserProfile;
    userProfileCachedAt?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string;
    userProfile?: UserProfile;
    userProfileCachedAt?: number;
  }
}
