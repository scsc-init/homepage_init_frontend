'use server';

import { ENABLE_TEST_UTILS } from '@/util/constants';
import { fetchBackendServer } from '@/util/fetch/server';

type DeleteTestUsersResponse = {
  ok: boolean;
  status: number;
  body: string | null;
};

export async function deleteTestUsers(): Promise<DeleteTestUsersResponse> {
  if (!ENABLE_TEST_UTILS) {
    return {
      ok: false,
      status: 404,
      body: null,
    };
  }

  const res = await fetchBackendServer('DELETE', '/api/test/users', {});

  return {
    ok: res.ok,
    status: res.status,
    body: await res.text(),
  };
}
