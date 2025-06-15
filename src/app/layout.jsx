import { Noto_Sans_KR } from "next/font/google";
import "./global.css";
import Header from "./header";
import Footer from "./footer";

const noto_sans_kr = Noto_Sans_KR({ subsets: ["latin"] });

import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <Head>
        <title>SCSC - 서울대 컴퓨터 연구 동아리</title>
        <meta
          name="description"
          content="서울대학교 컴퓨터 연구 동아리, SCSC의 공식 홈페이지입니다."
        />
        {/* Open Graph */}
        <meta property="og:title" content="SCSC - 서울대 컴퓨터 연구 동아리" />
        <meta
          property="og:description"
          content="서울대학교 컴퓨터 연구 동아리, SCSC의 공식 홈페이지입니다."
        />
        <meta property="og:url" content="https://scsc.oopy.io/" />{" "}
        {/*여기 나중에 바꾸기*/}
        <meta property="og:site_name" content="SCSC" />
        <meta property="og:image" content="../../public/img4.jpg" />{" "}
        {/*여기 나중에 바꾸기*/}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="SCSC Logo" />
        <meta property="og:type" content="website" />
        {/*근데 x로 바꼈는데 왜 아직도 twitter죠*/}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SCSC - 서울대 컴퓨터 연구 동아리" />
        <meta
          name="twitter:description"
          content="서울대학교 컴퓨터 연구 동아리, SCSC의 공식 홈페이지입니다."
        />
        <meta name="twitter:image" content="../../public/img4.jpg" />{" "}
        {/*여기 나중에 바꾸기*/}
      </Head>
      <body className={noto_sans_kr.className}>
        <Header />
        <div id="Body">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
