/**
 * 시간대가 명시되어있지 않은 ISO datetime 문자열을 UTC Date 객체로 파싱합니다.
 * 'Z', '+09:00' 같은 offset이 명시되어있는 datetime은 기존 시각을 유지합니다.
 */
export function parseUtcDate(value: string): Date {
  const normalizedValue = value.trim();
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalizedValue);

  return new Date(hasTimezone ? normalizedValue : `${normalizedValue}Z`);
}
