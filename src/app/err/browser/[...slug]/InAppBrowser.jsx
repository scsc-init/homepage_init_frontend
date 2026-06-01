'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@radix-ui/colors/red.css';
import '@radix-ui/colors/green.css';
import '@/styles/theme.css';
import { setRedirectAfterLogin } from '@/util/loginRedirect';
import styles from './page.module.css';
import CopyButton from '@/components/CopyButton';
import InAppBrowserOutButton from '@/components/InAppBrowserOutButton';
import { useMe } from '@/util/hooks/useMe';

const IN_APP_BROWSER_NAMES = {
  kakaotalk: '카카오톡',
  everytime: '에브리타임',
  instagram: '인스타그램',
  line: '라인',
};

export default function InAppBrowser({ initialRedirect = null, slug = [] }) {
  const { me } = useMe();
  const router = useRouter();
  const [inAppWarning, setInAppWarning] = useState(false);
  const [inAppBrowserName, setInAppBrowserName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!initialRedirect) return;
    setRedirectAfterLogin(initialRedirect);
  }, [initialRedirect]);

  useEffect(() => {
    if (me) router.replace('/api/auth/consume-redirect');
  }, [me, router]);

  useEffect(() => {
    setMounted(true);

    const ua = navigator.userAgent.toLowerCase();

    if (slug?.length > 0) {
      const key = slug[0];
      if (IN_APP_BROWSER_NAMES[key]) {
        setInAppWarning(true);
        setInAppBrowserName(IN_APP_BROWSER_NAMES[key]);
        return;
      }
    }

    for (const [key, name] of Object.entries(IN_APP_BROWSER_NAMES)) {
      if (ua.includes(key)) {
        setInAppWarning(true);
        setInAppBrowserName(name);
        return;
      }
    }

    setInAppWarning(true);
    setInAppBrowserName('인앱');
  }, [slug]);

  return (
    mounted &&
    inAppWarning && (
      <div className={styles['page-container']}>
        <div className={styles['warning-wrapper']}>
          <h1 style={{ marginBottom: 0 }}>
            <strong>{inAppBrowserName}</strong> 브라우저에서는
          </h1>
          <h1 style={{ marginTop: 0, marginBottom: '10px' }}>
            <strong>로그인</strong>이 실패할 수 있습니다
          </h1>
          <h3 style={{ marginBottom: '20px' }}>
            인앱 브라우저가 아닌 <strong>Chrome, Safari, 삼성 인터넷</strong> 등의 외부
            브라우저를 이용해주세요.
          </h3>
        </div>

        <div className={styles['copy-button-wrapper']}>
          <CopyButton link="scsc.dev" label="외부 브라우저 링크 복사" />
        </div>

        <div className={styles['copy-button-wrapper']}>
          <InAppBrowserOutButton />
        </div>
      </div>
    )
  );
}
