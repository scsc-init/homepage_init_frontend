import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ExternalRegisterClient from './ExternalRegisterClient';
import { authOptions } from '@/util/authOptions';
import { fetchBackendServer } from '@/util/fetch/server';
import * as validator from '@/util/validator';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

function cleanName(raw) {
  if (!raw) return '';

  return raw
    .normalize('NFC')
    .replace(/^[\s\-\u00AD\u2010-\u2015]+/u, '')
    .split('/')[0]
    .replace(/\s+/g, ' ')
    .trim();
}

async function submitExternalMemberApplication(form) {
  'use server';

  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !session?.user?.name || !session?.hashToken) {
    return {
      status: 401,
      detail: '로그인 정보가 만료되었습니다. 다시 로그인해주세요.',
    };
  }

  const email = session.user.email.toLowerCase();

  if (validator.email(email)) {
    return {
      status: 403,
      detail: 'SNU 계정은 일반 회원가입을 이용해주세요.',
    };
  }

  const response = await fetchBackendServer('POST', '/api/user/external/register', {
    body: {
      email,
      name: cleanName(session.user.name),
      phone: form.phone,
      student_id: form.student_id || null,
      reason: form.reason || null,
      hashToken: session.hashToken,
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return {
    status: response.status,
    detail: data?.detail ?? null,
  };
}

export default async function ExternalRegisterPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !session?.user?.name || !session?.hashToken) {
    redirect('/us/login');
  }

  const email = session.user.email.toLowerCase();

  if (validator.email(email)) {
    redirect('/us/register');
  }

  const res = await fetchBackendServer('POST', '/api/user/login', {
    body: {
      email,
      hashToken: session.hashToken,
    },
  });

  if (res.status === 200) {
    redirect('/');
  }

  if (res.status !== 404) {
    redirect('/us/login');
  }

  return (
    <ExternalRegisterClient
      email={email}
      name={cleanName(session.user.name)}
      submitApplication={submitExternalMemberApplication}
    />
  );
}
