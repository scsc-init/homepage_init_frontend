/**
 * 서버 API secret을 반환합니다.
 *
 * @returns API secret
 */
export function getApiSecret(): string {
  return process.env.API_SECRET || '';
}
