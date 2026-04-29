'use client';

import styles from './Footer.module.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { hideFooterRoutes, footerLogoData } from '@/util/constants';
import { getKVValue } from '@/util/fetchServerData';

export default function Footer() {
  const pathname = usePathname();
  const [footerMessage, setFooterMessage] = useState('');

  useEffect(() => {
    const getFooter = async () => {
      const res = await getKVValue('footer-message');
      if (res !== null) {
        setFooterMessage(res);
      } else {
        setFooterMessage('Footer 정보를 불러오지 못했습니다.');
        return;
      }
    };
    getFooter();
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
