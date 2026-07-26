'use server';

import { ENABLE_TEST_UTILS } from '@/util/constants';
import { fetchBackendServer } from '@/util/fetch/server';

type ActionResponse = {
  ok: boolean;
  status: number;
  body: unknown;
};

type CreateUserPayload = {
  email: string;
  name: string;
  student_id: string;
  phone: string;
  major_id: number;
  profile_picture: string;
  profile_picture_is_url: boolean;
  hashToken: string;
};

async function toActionResponse(res: Response): Promise<ActionResponse> {
  const text = await res.text();
  let body: unknown = null;

  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = text;
    }
  }

  return {
    ok: res.ok,
    status: res.status,
    body,
  };
}

export async function createUser(payload: CreateUserPayload): Promise<ActionResponse> {
  const res = await fetchBackendServer(
    'POST',
    ENABLE_TEST_UTILS ? '/api/test/users' : '/api/user/create',
    { body: payload },
  );

  return toActionResponse(res);
}
