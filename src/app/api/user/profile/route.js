import { handleApiRequest } from '@/app/api/apiWrapper';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await handleApiRequest('GET', '/api/user/profile');
  if (!res.ok) return res;
  const userData = await res.json();

  const profilePictureSrc = userData.profile_picture_is_url
    ? userData.profile_picture
    : userData.profile_picture
      ? `${process.env.BACKEND_URL || ''}/${userData.profile_picture}`
      : null;

  return NextResponse.json({
    ...userData,
    profile_picture: profilePictureSrc,
  });
}
