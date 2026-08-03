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

function validateWithCallback(validate, value) {
  return new Promise((resolve) => {
    validate(value, resolve);
  });
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

  const rawName = typeof form?.name === 'string' ? form.name.trim().slice(0, 64) : '';
  const name = rawName || cleanName(session.user.name);
  const validName = await validateWithCallback(validator.name, name);

  if (!validName) {
    return {
      status: 400,
      detail: '이름을 올바르게 입력해주세요.',
    };
  }

  const phone = String(form?.phone ?? '').replace(/\D/g, '');
  const studentId = String(form?.student_id ?? '').replace(/\D/g, '');
  const reason = typeof form?.reason === 'string' ? form.reason.trim().slice(0, 1000) : '';
  const kakaoName =
    typeof form?.kakao_name === 'string' ? form.kakao_name.trim().slice(0, 64) : '';
  const validPhone = await validateWithCallback(validator.phoneNumber, phone);

  if (!validPhone) {
    return {
      status: 400,
      detail: '전화번호 형식이 올바르지 않습니다.',
    };
  }

  if (studentId) {
    const validStudentId = await validateWithCallback(validator.studentID, studentId);

    if (!validStudentId) {
      return {
        status: 400,
        detail: '학번 형식이 올바르지 않습니다.',
      };
    }
  }

  let response;

  try {
    response = await fetchBackendServer('POST', '/api/user/external/register', {
      body: {
        email,
        name,
        phone,
        student_id: studentId || null,
        reason: reason || null,
        kakao_name: kakaoName || null,
        hashToken: session.hashToken,
      },
    });
  } catch (error) {
    console.error(error);

    return {
      status: 503,
      detail: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
    };
  }

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
