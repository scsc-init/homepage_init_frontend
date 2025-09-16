import { Noto_Sans_KR } from "next/font/google";
import "./global.css";
import HeaderWrapper from "./HeaderWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import dynamic from "next/dynamic";
import { SessionContext } from "next-auth/react";
import Providers from "./Providers.jsx";

const FooterWrapper = dynamic(() => import("@/app/FooterWrapper"), {
  ssr: false,
});

const noto_sans_kr = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "SCSC: 컴퓨터 연구회",
    template: "%s | SCSC",
  },
  description: "서울대학교 컴퓨터 연구 동아리, SCSC의 공식 홈페이지입니다.",
  openGraph: {
    title: "SCSC",
    description: "서울대학교 컴퓨터 연구 동아리, SCSC의 공식 홈페이지입니다.",
    url: "https://homepage-init-frontend-ixxt.vercel.app/",
    siteName: "SCSC",
    images: [
      { url: "/opengraph.png", width: 1200, height: 630, alt: "SCSC Logo" },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SCSC",
    description: "서울대학교 컴퓨터 연구 동아리, SCSC의 공식 홈페이지입니다.",
    images: ["/img4.jpg"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem("theme");
                  if (theme === "dark") {
                    document.documentElement.classList.add("dark");
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var ls = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = ls ? (ls === 'dark') : prefersDark;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{var d=document.documentElement;var m=localStorage.getItem('theme');var dark=m?m==='dark':true;d.classList.toggle('dark',dark)}catch(e){}}()`,
          }}
        />
      </head>
      <body className={noto_sans_kr.className}>
        <div id="RootContainer">
          <HeaderWrapper />
          <main id="MainContent">
            <Providers>{children}</Providers>
          </main>
          <ThemeToggle />
          <FooterWrapper />
        </div>
      </body>
    </html>
  );
}
