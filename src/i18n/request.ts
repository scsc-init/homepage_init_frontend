import { headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const host = (await headers()).get('host') ?? '';

  const locale = host.startsWith('en.') ? 'en-US' : 'ko-KR';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
