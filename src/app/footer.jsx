"use client";

import MailLogo from "@@/vectors/mail.svg";
import GithubLogo from "@@/vectors/github.svg";
import InstagramLogo from "@@/vectors/instagram.svg";
import "./footer.css";
import { usePathname } from "next/navigation";

function Footer() {
  const pathname = usePathname();
  const hideFooterRoutes = ["/us/login", "/signup", "/about/my-page"];

  if (hideFooterRoutes.includes(pathname)) return null;

  return (
    <div id="Footer">
      <div id="FooterInner">
        <div id="FooterInfoContainer">
          <div>
            <b>서울대학교 컴퓨터 연구회</b>
          </div>
          <div>회장 한성재 010-8916-9161</div>
          <div>scsc.snu@gmail.com</div>
          {/* <Link href="/rule">
          <div className="linkText" style={{ fontWeight: 400 }}>
            동아리 회칙
          </div>
        </Link> */}
        </div>
        <div id="FooterLogoList">
          <a
            href="mailto:scsc.snu@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="FooterLogo">
              <MailLogo />
            </div>
          </a>
          {/* <a
          href="https://www.facebook.com/scscian/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="logoContainer">
            <Image
              src={FacebookLogo}
              width={24}
              height={24}
              alt="페이스북 로고"
            />
          </div>
        </a> */}
          <a
            href="https://github.com/SNU-SCSC"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="FooterLogo">
              <GithubLogo />
            </div>
          </a>
          <a
            href="https://www.instagram.com/scsc_snu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="FooterLogo">
              <InstagramLogo />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
