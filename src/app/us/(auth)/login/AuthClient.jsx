// src/app/us/login/AuthClient.jsx
'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import './page.css';

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

export default function AuthClient() {
  const [inAppWarning, setInAppWarning] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const error = params.get('error');

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
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    router.replace(url.pathname + url.search);
  }, [error, router]);

  useEffect(() => {
    let isInAppBrowser = false;
    let inAppBrowserName = '';
    const ua = navigator.userAgent.toLowerCase();
    for (const [key, name] of Object.entries(IN_APP_BROWSER_NAMES)) {
      const re = new RegExp(`\\b${key}\\b`);
      if (re.test(ua)) {
        isInAppBrowser = true;
        inAppBrowserName = name;
        break;
      }
    }
    if (isInAppBrowser) {
      log('inapp_warning_shown', { name: inAppBrowserName });
      alert(
        `${inAppBrowserName} 인앱 브라우저에서는 로그인이 실패할 수 있습니다. 외부 브라우저를 이용해주세요.`,
      );
      setInAppWarning(true);
    }
  }, []);

  return (
    <div id="GoogleSignupContainer">
      <div className="GoogleSignupCard">
        <div className="main-logo-wrapper__login">
          <img src="/main/main-logo.png" alt="Main Logo" className="main-logo__login logo" />
          <div className="main-subtitle__login">
            Seoul National University Computer Study Club
          </div>
        </div>
        <p className="login-description">SNU 구글 계정으로 로그인/회원가입</p>
        <div className="google-signin-button-wrapper">
          <button
            type="button"
            className="GoogleLoginBtn"
            onClick={() => {
              if (authLoading) return;
              setAuthLoading(true);
              log('click_login_button', { provider: 'google' });
              signIn('google', { callbackUrl: '/us/register' });
            }}
            disabled={inAppWarning || authLoading}
            aria-disabled={inAppWarning || authLoading}
          >
            <span className="GoogleIcon" aria-hidden="true">
              <svg viewBox="0 0 48 48">
                <path d="M24 9.5c3.7 0 7 1.3 9.6 3.8l6.4-6.4C36.3 3 30.6 1 24 1 14.7 1 6.7 6.3 2.9 14.1l7.9 6.1C12.4 14.9 17.7 9.5 24 9.5z" />
                <path d="M46.5 24c0-1.6-.2-3.1-.5-4.5H24v9h12.6c-.5 2.7-2.1 5-4.5 6.5l7.1 5.5C43.9 36.9 46.5 30.9 46.5 24z" />
                <path d="M10.8 28.2c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1.1 15.6 0 19.6 0 23.5 0 27.4 1.1 31.4 2.9 34.3l7.9-6.1z" />
                <path d="M24 47c6.5 0 12.1-2.1 16.1-5.8l-7.1-5.5c-2 1.3-4.6 2.1-9 2.1-6.3 0-11.6-5.4-13.2-10.2l-7.9 6.1C6.7 41.7 14.7 47 24 47z" />
              </svg>
            </span>
            <span className="GoogleLoginText">Google 계정으로 로그인</span>
          </button>
          {inAppWarning && (
            <p className="InAppWarning">
              인앱 브라우저에서는 인증이 차단될 수 있어요. 외부 브라우저로 다시 열어주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
