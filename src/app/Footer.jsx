"use client";

import "./footer.css";
import { usePathname } from "next/navigation";
import Image from "next/image";

function Footer({ discordInviteLink }) {
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
          <div className="FooterLogo">
            <a
              href="mailto:scsc.snu@gmail.com"
              className="ContactLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/vectors/mail.svg"
                alt="Mail"
                width={24}
                height={24}
                className="ico"
              />
            </a>
          </div>
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
          <div className="FooterLogo">
            <a
              href={discordInviteLink}
              className="ContactLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/vectors/discord.svg"
                alt="Discord"
                width={24}
                height={24}
                className="ico"
              />
            </a>
          </div>
          <div className="FooterLogo">
            <a
              href="https://github.com/SNU-SCSC"
              className="ContactLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/vectors/github.svg"
                alt="GitHub"
                width={24}
                height={24}
                className="ico"
              />
            </a>
          </div>
          <div className="FooterLogo">
            <a
              href="https://www.instagram.com/scsc_snu/?hl=ko"
              className="ContactLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/vectors/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="ico"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
