import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./global.css";
import Header from "./header";
import Footer from "./footer";

const noto_sans_kr = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SCSC Temporary Homepage",
  description: "Temporary Homepage for Seoul Nat'l Computer Study Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
