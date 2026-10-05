import { defineRouting } from 'next-intl/routing';

const isDevelopment = process.env.NODE_ENV === 'development';

export const routing = defineRouting({
  locales: ['ko-KR', 'en-US'],
  defaultLocale: 'ko-KR',
  localePrefix: 'never',
  domains: isDevelopment
    ? [
        {
          domain: 'localhost:3000',
          defaultLocale: 'ko-KR',
          locales: ['ko-KR'],
        },
        {
          domain: 'en.localhost:3000',
          defaultLocale: 'en-US',
          locales: ['en-US'],
        },
      ]
    : [
        {
          domain: 'scsc.dev',
          defaultLocale: 'ko-KR',
          locales: ['ko-KR'],
        },
        {
          domain: 'en.scsc.dev',
          defaultLocale: 'en-US',
          locales: ['en-US'],
        },
      ],
});
