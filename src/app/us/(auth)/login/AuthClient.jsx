'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import '@radix-ui/colors/red.css';
import '@radix-ui/colors/green.css';
import '@/styles/theme.css';
import { MainLogoImage } from '@/components/common/MainLogoImage';
import { replaceLoginWithRedirect, setRedirectAfterLogin } from '@/util/loginRedirect';
import styles from '../auth.module.css';
import CopyButton from '@/components/CopyButton';
import Image from 'next/image';

const IN_APP_BROWSER_NAMES = {
  kakaotalk: '카카오톡',
  everytimeapp: '에브리타임',
  instagram: '인스타그램',
  line: '라인',
};

function log(event, data = {}) {
  try {
    const body = JSON.stringify({ event, data, ts: new Date().toISOString() });
    const url = '/api/log';
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    }
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {}
}

function InAppBrowserOutButton() {
  const [isRedirectPossible, setIsRedirectPossible] = useState(false);
  const [useragt, setUseragt] = useState('');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setUseragt(ua);
    if (ua.match(/kakaotalk|line/i)) {
      setIsRedirectPossible(true);
    }
  }, []);

  const onClick = () => {
    const target_url = window.location.href;
    if (useragt.match('kakaotalk')) {
      window.location.href =
        'kakaotalk://web/openExternal?url=' + encodeURIComponent(target_url);
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

export default function AuthClient({ initialRedirect = null }) {
  const [inAppWarning, setInAppWarning] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [inAppBrowserName, setInAppBrowserName] = useState('');
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const error = params.get('error');

  useEffect(() => {
    if (!initialRedirect) return;
    setRedirectAfterLogin(initialRedirect);
  }, [initialRedirect]);

  useEffect(() => {
    if (!error) return;
    switch (error) {
      case 'invalid_email':
        alert('SNU 구글 계정(@snu.ac.kr)으로만 로그인할 수 있습니다.');
        break;
      case 'no_information':
        alert('구글 계정에 등록된 정보가 올바르지 않습니다.');
        break;
      default:
        alert('로그인이 실패했습니다. 다시 시도해주세요.');
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      router.replace(url.pathname + url.search);
    } catch {
      replaceLoginWithRedirect(router);
    }
  }, [error, router]);

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
    <div id={styles['GoogleSignupContainer']}>
      <div className={styles['GoogleSignupCard']}>
        <div className={styles['main-logo-wrapper__login']}>
          <MainLogoImage
            className={`${styles['main-logo__login']} logo`}
            width={1976}
            height={670}
            loading="eager"
          />
          <div className={styles['main-subtitle__login']}>
            Seoul National University Computer Study Club
          </div>
        </div>
        {mounted && inAppWarning && (
          <>
            <div className={styles['warning-wrapper']}>
              <h3 style={{ marginBottom: '0px' }}>
                <strong>{inAppBrowserName}</strong> 브라우저에서는
              </h3>
              <h3 style={{ marginTop: '0px' }}>
                <strong>로그인</strong>이 실패할 수 있습니다
              </h3>
              <p style={{ marginBottom: '20px' }}>
                인앱 브라우저가 아닌 <strong>Chrome, Safari, 삼성 인터넷</strong> 등의 외부
                브라우저를 이용하면 더 안전합니다.
              </p>
            </div>
            <div className={styles['copy-button-wrapper']}>
              <CopyButton link="scsc.dev" label="외부 브라우저 링크 복사" />
            </div>
            <div className={styles['copy-button-wrapper']}>
              <InAppBrowserOutButton />
            </div>
          </>
        )}
        <p className={styles['login-description']}>SNU 구글 계정으로 로그인/회원가입</p>
        <div className={styles['google-signin-button-wrapper']}>
          <button
            type="button"
            className={styles['GoogleLoginBtn']}
            onClick={async () => {
              if (authLoading) return;
              setAuthLoading(true);
              log('click_login_button', { provider: 'google' });
              await signIn('google', { callbackUrl: '/us/login/callback' });
            }}
            disabled={inAppWarning || authLoading}
            aria-disabled={inAppWarning || authLoading}
          >
            <span className={styles['GoogleIcon']} aria-hidden="true">
              <svg viewBox="0 0 48 48">
                <path d="M24 9.5c3.7 0 7 1.3 9.6 3.8l6.4-6.4C36.3 3 30.6 1 24 1 14.7 1 6.7 6.3 2.9 14.1l7.9 6.1C12.4 14.9 17.7 9.5 24 9.5z" />
                <path d="M46.5 24c0-1.6-.2-3.1-.5-4.5H24v9h12.6c-.5 2.7-2.1 5-4.5 6.5l7.1 5.5C43.9 36.9 46.5 30.9 46.5 24z" />
                <path d="M10.8 28.2c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1.1 15.6 0 19.6 0 23.5 0 27.4 1.1 31.4 2.9 34.3l7.9-6.1z" />
                <path d="M24 47c6.5 0 12.1-2.1 16.1-5.8l-7.1-5.5c-2 1.3-4.6 2.1-9 2.1-6.3 0-11.6-5.4-13.2-10.2l-7.9 6.1C6.7 41.7 14.7 47 24 47z" />
              </svg>
            </span>
            <span className={styles['GoogleLoginText']}>Google 계정으로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
}
