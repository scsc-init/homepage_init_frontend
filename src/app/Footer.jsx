'use client';

import './footer.css';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { hideFooterRoutes, footerLogoData } from '@/util/constants';

function Footer() {
  const pathname = usePathname();

  if (hideFooterRoutes.includes(pathname)) return null;

  return (
    <div id="Footer">
      <div id="FooterInner">
        <div id="FooterInfoContainer">
          <div>
            <b>서울대학교 컴퓨터 연구회</b>
          </div>
          <div>회장 한성재 010-5583-1811</div>
          <div>scsc.snu@gmail.com</div>
          {/* <Link href="/rule">
                <div className="linkText" style={{ fontWeight: 400 }}>
                  동아리 회칙
                </div>
              </Link> */}
        </div>
        <div id="FooterLogoList">
          {footerLogoData.map(({ href, src, alt }) => (
            <div className="FooterLogo" key={alt}>
              <a
                href={href}
                className="ContactLink"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={src}
                  alt={alt}
                  width={24}
                  height={24}
                  className="ico"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Footer;
