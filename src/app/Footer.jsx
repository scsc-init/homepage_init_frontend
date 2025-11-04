'use client';

import styles from './Footer.module.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { hideFooterRoutes, footerLogoData } from '@/util/constants';

export default function Footer() {
  const pathname = usePathname();
  const hideFooterRoutes = ['/us/login', '/signup', '/about/my-page'];
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

  const divideMessage = Array.isArray(String(footerMessage).split('\\n'))
    ? footerMessage.split('\\n')
    : ['정보를 불러오지 못했습니다.'];

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.infoContainer}>
          <div>
            <div>
              {divideMessage.map((message) => (
                <p className={styles.message} key={message}>
                  {message}
                </p>
              ))}
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
