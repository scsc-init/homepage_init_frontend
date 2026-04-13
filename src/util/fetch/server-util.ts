// @/util/fetch/server-util.ts

import type { GlobalStatus } from '@/types/system';
import { fetchBackendServer } from './server';

/** Fetches current SCSC global status. */
export async function fetchGlobalStatus(): Promise<GlobalStatus> {
  return fetchBackendServer<GlobalStatus>('GET', '/api/scsc/global/status');
}
