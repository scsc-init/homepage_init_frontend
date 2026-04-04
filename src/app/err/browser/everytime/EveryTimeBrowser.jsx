'use client';

import { useEffect, useState } from 'react';
import '@radix-ui/colors/red.css';
import '@radix-ui/colors/green.css';
import '@/styles/theme.css';
import { setRedirectAfterLogin } from '@/util/loginRedirect';
import styles from './page.module.css';
import CopyButton from '@/components/CopyButton';
import Image from 'next/image';

const IN_APP_BROWSER_NAMES = {
  kakaotalk: '카카오톡',
  everytimeapp: '에브리타임',
  instagram: '인스타그램',
  line: '라인',
};

function InAppBrowserOutButton() {
  const [isRedirectPossible, setIsRedirectPossible] = useState(false);
  const [useragt, setUseragt] = useState('');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setUseragt(ua);
    if (ua.match(/everytimeapp/i)) {
      setIsRedirectPossible(true);
    }
  }, []);

  const onClick = () => {
    const target_url = window.location.href;
    if (useragt.match('everytimeapp')) {
      window.location.href =
        'everytimeapp://web/openExternal?url=' + encodeURIComponent(target_url);
    } else if (useragt.match('line')) {
      if (target_url.indexOf('?') !== -1) {
        window.location.href = target_url + '&openExternalBrowser=1';
      } else {
        window.location.href = target_url + '?openExternalBrowser=1';
      }
    }
  };

  if (!isRedirectPossible) {
    if (!useragt.match('everytimeapp')) return;
    if (useragt.match(/iphone|ipad|ipod/i)) {
      return (
        <p>
          상단의 화살표 아이콘({' '}
          <Image
            src="/vectors/open-external-link-icon.svg"
            width={12}
            height={12}
            className="ico"
            alt="arrow button"
          />{' '}
          ) 클릭 &rarr; 외부 브라우저로 열기
        </p>
      );
    } else {
      return <p>상단의 점 세 개( ⋮ ) 클릭 &rarr; 외부 브라우저로 열기</p>;
    }
  }

  return <button onClick={onClick}>외부 브라우저로 이동</button>;
}

export default function EveryTimeBrowser({ initialRedirect = null }) {
  const [inAppWarning, setInAppWarning] = useState(false);
  const [inAppBrowserName, setInAppBrowserName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!initialRedirect) return;
    setRedirectAfterLogin(initialRedirect);
  }, [initialRedirect]);

  useEffect(() => {
    setMounted(true);

    const ua = navigator.userAgent.toLowerCase();

    for (const [key, name] of Object.entries(IN_APP_BROWSER_NAMES)) {
      const re = new RegExp(`\\b${key}\\b`);
      if (re.test(ua)) {
        setInAppWarning(true);
        setInAppBrowserName(name);
        break;
      }
    }
  }, []);

  return (
    mounted &&
    inAppWarning && (
      <>
        <div className={styles['page-container']}>
          <div className={styles['warning-wrapper']}>
            <h1 style={{ marginBottom: '0px' }}>
              <strong>{inAppBrowserName}</strong> 브라우저에서는
            </h1>
            <h1 style={{ marginTop: '0px', marginBottom: '10px' }}>
              <strong>로그인</strong>이 실패할 수 있습니다
            </h1>
            <h3 style={{ marginBottom: '20px' }}>
              인앱 브라우저가 아닌 <strong>Chrome, Safari, 삼성 인터넷</strong> 등의 외부
              브라우저를 이용하면 더 안전합니다.
            </h3>
          </div>
          <div className={styles['copy-button-wrapper']}>
            <CopyButton link="scsc.dev" label="외부 브라우저 링크 복사" />
          </div>
          <div className={styles['copy-button-wrapper']}>
            <InAppBrowserOutButton />
          </div>
        </div>
      </>
    )
  );
}
