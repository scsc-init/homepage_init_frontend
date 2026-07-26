'use server';

import { ENABLE_TEST_UTILS } from '@/util/constants';
import { fetchBackendServer } from '@/util/fetch/server';

async function toActionResponse(res) {
  const text = await res.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
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

export async function createUser(payload) {
  const res = await fetchBackendServer(
    'POST',
    ENABLE_TEST_UTILS ? '/api/test/users' : '/api/user/create',
    { body: payload },
  );

  return toActionResponse(res);
}
