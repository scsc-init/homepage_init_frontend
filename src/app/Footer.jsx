'use client';

import styles from './Footer.module.css';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { hideFooterRoutes, footerLogoData } from '@/util/constants';

export default function Footer() {
  const pathname = usePathname();
  if (hideFooterRoutes.includes(pathname)) return null;

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.infoContainer}>
          <div>
            <b>서울대학교 컴퓨터 연구회</b>
          </div>
          <div>회장 한성재 010-5583-1811</div>
          <div>scsc.snu@gmail.com</div>
        </div>
        <div className={styles.logoList}>
          {footerLogoData.map(({ href, src, alt }) => (
            <div className={styles.logo} key={alt}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                <Image src={src} alt={alt} width={24} height={24} className="logo" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
