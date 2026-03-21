import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string | null;
  }

  interface User {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string | null;
  }
}
