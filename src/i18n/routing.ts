import { defineRouting } from 'next-intl/routing';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseDomain = isDevelopment ? 'localhost:3000' : 'scsc.dev';
const devLocale = isDevelopment ? process.env.NEXT_PUBLIC_I18N_DEV_LOCALE : undefined;
const defaultLocale = devLocale === 'en-US' || devLocale === 'ru-RU' ? devLocale : 'ko-KR';

export const routing = defineRouting({
  locales: ['ko-KR', 'en-US', 'ru-RU'],
  defaultLocale,
  localePrefix: 'never',
  domains:
    defaultLocale === 'ko-KR'
      ? [
          { domain: baseDomain, defaultLocale, locales: [defaultLocale] },
          { domain: `en.${baseDomain}`, defaultLocale: 'en-US', locales: ['en-US'] },
          { domain: `ru.${baseDomain}`, defaultLocale: 'ru-RU', locales: ['ru-RU'] },
        ]
      : [{ domain: baseDomain, defaultLocale, locales: [defaultLocale] }],
});
