/** Keep the existing utc2kst conversion and vary only the display locale. */
export function formatExecutiveDate(date: string | number | Date, locale: string): string {
  const utc = new Date(date).getTime();
  const kst = new Date(utc + 9 * 60 * 60 * 1000);

  return kst.toLocaleString(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
}
