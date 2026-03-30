import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string;
  }

  interface User {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendJwt?: string;
    registered?: boolean;
    hashToken?: string;
  }
}
