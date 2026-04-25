// @/util/fetch/server-util.ts

import type { GlobalStatus } from '@/types/system';
import { fetchBackendServerJson } from './server';

/** Fetches current SCSC global status. */
export async function fetchGlobalStatus(): Promise<GlobalStatus> {
  return fetchBackendServerJson<GlobalStatus>('GET', '/api/scsc/global/status');
}
