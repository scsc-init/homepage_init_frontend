import { Noto_Sans_KR } from 'next/font/google';
import './global.css';
import Header from './Header';
import Footer from './Footer';
import ThemeToggle from '@/components/ThemeToggle';
import Providers from './Providers.jsx';
import { cookies } from 'next/headers';

const noto_sans_kr = Noto_Sans_KR({ subsets: ['latin'] });

export const metadata = {
  title: { default: 'SCSC: 서울대 컴퓨터 연구회', template: '%s | SCSC' },
  description:
    '서울대학교 컴퓨터 연구회 SCSC의 공식 홈페이지입니다. SCSC는 SIG(Special Interested Group) 또는 PIG를 통해 스터디와 연구를 진행합니다. 이에 더해 SCSC는, SKYST 대회 진행 및 세미나 운영을 진행하고 있습니다.',
  openGraph: {
    title: '서울대학교 SCSC',
    description:
      '서울대학교 컴퓨터 연구회 SCSC의 공식 홈페이지입니다. SCSC는 SIG(Special Interested Group) 또는 PIG를 통해 스터디와 연구를 진행합니다. 이에 더해 SCSC는, SKYST 대회 진행 및 세미나 운영을 진행하고 있습니다.',
    url: 'https://scsc.dev/',
    siteName: 'SCSC',
    images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '서울대학교 SCSC',
    description: '서울대학교 컴퓨터 연구 동아리, SCSC의 공식 홈페이지입니다.',
    images: ['/opengraph.png'],
  },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  const theme = cookies().get('theme')?.value;
  const initialDark = theme === 'dark' ? true : theme === 'light' ? false : undefined;

  return (
    <html lang="ko" suppressHydrationWarning className={(initialDark ?? true) ? 'dark' : ''}>
      <head>
        <meta name="color-scheme" content="dark light" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    var d = document.documentElement;
    if (!d.classList.length) {
      var c = document.cookie.split('; ').find(function (r) { return r.indexOf('theme=') === 0; });
      var v = c ? decodeURIComponent(c.split('=')[1]) : '';
      if (!v) {
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        d.classList.toggle('dark', !!prefersDark);
      }
    }
  } catch (_) {}
})();`,
          }}
        />
      </head>
      <body className={noto_sans_kr.className}>
        <div id="RootContainer">
          <Header />
          <main id="MainContent">
            <Providers>{children}</Providers>
          </main>
          <ThemeToggle initialDark={initialDark} />
          <Footer />
        </div>
      </body>
    </html>
  );
}
