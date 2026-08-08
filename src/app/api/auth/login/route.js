import { NextResponse } from 'next/server';
import { fetchBackendServer } from '@/util/fetch/server';
import { resolveProfileImage } from '@/util/profileImage';

export async function POST(request) {
  const apiSecret = process.env.API_SECRET;

  if (!apiSecret) {
    console.error('API_SECRET is missing');
    return NextResponse.json({ error: 'server misconfigured' }, { status: 500 });
  }

  const res = await fetchBackendServer(
    'POST',
    '/api/user/login',
    { skipSession: true },
    request,
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'login failed' }, { status: 400 });
  }

  let jwt;
  try {
    const data = await res.json();
    jwt = data.jwt;
  } catch {
    return NextResponse.json({ error: 'login failed' }, { status: 400 });
  }

  if (!jwt) return NextResponse.json({ error: 'login failed' }, { status: 400 });

  let userProfile = null;

  try {
    const profileRes = await fetchBackendServer('GET', '/api/user/profile', {
      skipSession: true,
      headers: {
        'x-jwt': jwt,
        'x-api-secret': apiSecret,
      },
    });

    if (!profileRes.ok) {
      return NextResponse.json({ error: 'profile fetch failed' }, { status: 400 });
    }

    const userData = await profileRes.json();

    if (userData) {
      userProfile = {
        ...userData,
        profile_picture: resolveProfileImage(userData, ''),
      };
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json({ error: 'profile fetch failed' }, { status: 400 });
  }

  if (!userProfile) {
    return NextResponse.json({ error: 'profile fetch failed' }, { status: 400 });
  }

  return NextResponse.json({ success: true, jwt, userProfile });
}
