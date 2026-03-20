/**
 * 백엔드 base URL을 반환합니다.
 *
 * @returns Backend base URL
 */
export function getBaseUrl(): string {
  return process.env.BACKEND_URL || '';
}
