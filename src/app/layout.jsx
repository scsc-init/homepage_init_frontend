import { Noto_Sans_KR } from "next/font/google";
import "./global.css";
import HeaderWrapper from "./HeaderWrapper";
import Footer from "./footer.jsx";

const noto_sans_kr = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata = {
  title: "SCSC - 서울대 컴퓨터 연구 동아리",
  description: "서울대학교 컴퓨터 연구 동아리, SCSC의 공식 홈페이지입니다.",
  openGraph: {
    title: "SCSC - 서울대 컴퓨터 연구 동아리",
    description: "서울대학교 컴퓨터 연구 동아리, SCSC의 공식 홈페이지입니다.",
    url: "https://homepage-init-frontend-ixxt.vercel.app/",
    siteName: "SCSC",
    images: [
      {
        url: "/img4.jpg",
        width: 1200,
        height: 630,
        alt: "SCSC Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SCSC - 서울대 컴퓨터 연구 동아리",
    description: "서울대학교 컴퓨터 연구 동아리, SCSC의 공식 홈페이지입니다.",
    images: ["/img4.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={noto_sans_kr.className}>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <div id="RootContainer">
          <HeaderWrapper />
          <main id="MainContent">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
