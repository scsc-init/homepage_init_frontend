import { headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async () => {
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? '';

  const domain = routing.domains?.find(
    ({ domain }) => domain.toLowerCase() === host.toLowerCase(),
  );

  const locale = domain?.defaultLocale ?? routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
