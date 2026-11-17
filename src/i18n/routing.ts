import { defineRouting } from 'next-intl/routing';

const isDevelopment = process.env.NODE_ENV === 'development';

const baseRouting = defineRouting({
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

// Development-only: test English on the main localhost origin.
export const routing =
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_I18N_DEV_LOCALE === 'en-US'
    ? defineRouting({
        locales: ['ko-KR', 'en-US'],
        defaultLocale: 'en-US',
        localePrefix: 'never',
        domains: [
          {
            domain: 'localhost:3000',
            defaultLocale: 'en-US',
            locales: ['en-US'],
          },
        ],
      })
    : baseRouting;
