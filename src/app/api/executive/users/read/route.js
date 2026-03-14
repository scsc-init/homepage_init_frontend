import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';
import { getBaseUrl } from '@/util/getBaseUrl';

const session = await getServerSession(authOptions);
const jwt = session?.backendJwt;
if (!jwt) throw new Error('로그인 필요');

const res = await fetch(`${getBaseUrl()}/api/executive/users/read`, {
  method: 'GET',
  headers: { 'x-jwt': jwt },
  cache: 'no-store',
});
