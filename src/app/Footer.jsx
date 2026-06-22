'use client';

import styles from './Footer.module.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { hideFooterRoutes, footerLogoData, footerMenuData } from '@/util/constants';
import { getKvsClient } from '@/util/fetch/client-util';

export default function Footer() {
  const pathname = usePathname();
  const [footerMessage, setFooterMessage] = useState('');
  const [kvHrefs, setKvHrefs] = useState({});

  useEffect(() => {
    const fetchAllKvs = async () => {
      const hrefKeys = footerLogoData
        .map((item) => item.hrefKvKey)
        .filter((k) => typeof k === 'string' && k.length > 0);
      const allKeys = ['footer-message', ...hrefKeys];
      const values = await getKvsClient(allKeys);

      setFooterMessage(values[0] || 'Footer 정보를 불러오지 못했습니다.');

      const hrefEntries = hrefKeys.map((key, i) => [key, values[i + 1]]);
      setKvHrefs(Object.fromEntries(hrefEntries));
    };
    fetchAllKvs();
  }, []);

  if (hideFooterRoutes.includes(pathname)) return null;

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.infoContainer}>
          <div>
            <div>
              <p className={styles.message}>
                {(footerMessage || '')
                  .replace(/\\n/g, '\n')
                  .split('\n')
                  .map((line, i) => (
                    <span key={`${line}-${i}`}>
                      {line}
                      <br />
                    </span>
                  ))}
              </p>
            </div>
            <nav className={styles.footerNav} aria-label="People">
              <span className={styles.footerNavTitle}>People</span>
              <ul className={styles.footerNavList}>
                {footerMenuData.map((item) => (
                  <li key={item.url}>
                    <Link href={item.url}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className={styles.logoList}>
          {footerLogoData.map(({ href, src, alt, hrefKvKey }) => {
            const resolvedHref = hrefKvKey ? kvHrefs[hrefKvKey] || '' : href;
            const isValidHref =
              typeof resolvedHref === 'string' && /^(https?:\/\/|mailto:)/i.test(resolvedHref);
            return (
              <div className={styles.logo} key={alt}>
                {isValidHref ? (
                  <a href={resolvedHref} target="_blank" rel="noopener noreferrer">
                    <Image src={src} alt={alt} width={24} height={24} className="logo" />
                  </a>
                ) : (
                  <span aria-disabled="true">
                    <Image src={src} alt={alt} width={24} height={24} className="logo" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
