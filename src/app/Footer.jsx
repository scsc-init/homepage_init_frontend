'use client';

import styles from './Footer.module.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { hideFooterRoutes, footerLogoData } from '@/util/constants';
import { getKvClient } from '@/util/fetch/client-util';

export default function Footer() {
  const pathname = usePathname();
  const [footerMessage, setFooterMessage] = useState('');
  const [kvHrefs, setKvHrefs] = useState({});

  useEffect(() => {
    const getFooter = async () => {
      const value = await getKvClient('footer-message');
      setFooterMessage(value || 'Footer 정보를 불러오지 못했습니다.');
    };
    const getKvHrefs = async () => {
      const keys = footerLogoData
        .map((item) => item.hrefKvKey)
        .filter((k) => typeof k === 'string' && k.length > 0);
      if (keys.length === 0) return;
      const entries = await Promise.all(
        keys.map(async (key) => {
          const value = await getKvClient(key);
          return [key, value];
        }),
      );
      setKvHrefs(Object.fromEntries(entries));
    };

    getFooter();
    getKvHrefs();
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
          </div>
        </div>
        <div className={styles.logoList}>
          {footerLogoData.map(({ href, src, alt, hrefKvKey }) => {
            const resolvedHref = hrefKvKey ? kvHrefs[hrefKvKey] || '' : href;
            return (
              <div className={styles.logo} key={alt}>
                <a href={resolvedHref} target="_blank" rel="noopener noreferrer">
                  <Image src={src} alt={alt} width={24} height={24} className="logo" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
