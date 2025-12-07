'use client';

import styles from './Footer.module.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { hideFooterRoutes, footerLogoData } from '@/util/constants';

export default function Footer() {
  const pathname = usePathname();
  const [footerMessage, setFooterMessage] = useState('');
  const key = 'footer-message';

  useEffect(() => {
    const getFooter = async () => {
      const res = await fetch(`/api/kv/${key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const footer = await res.json();
        setFooterMessage(footer.value);
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
                {(footerMessage || '').split('\n').map((line, i) => (
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
