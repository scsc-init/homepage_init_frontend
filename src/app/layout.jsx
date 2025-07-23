// app/layout.jsx
"use client";

import { usePathname } from "next/navigation";
import { Noto_Sans_KR } from "next/font/google";
import "./global.css";
import Header from "./header";
import Footer from "./footer.jsx";

const noto_sans_kr = Noto_Sans_KR({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideFooterRoutes = ["/us/login", "/signup", "/about/my-page"];

  return (
    <html lang="ko">
      <body className={noto_sans_kr.className}>
        <div id="RootContainer">
          <Header />
          <main id="MainContent">{children}</main>
          {!hideFooterRoutes.includes(pathname) && <Footer />}
        </div>
      </body>
    </html>
  );
}
