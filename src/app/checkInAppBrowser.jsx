'use client';

import './page.css';
import { useEffect, useState } from 'react';
import { MainLogoImage } from '@/components/common/MainLogoImage';
import InAppBrowserOutButton from '@components/InAppBrowserOutButton';

const IN_APP_BROWSER_NAMES = {
  kakaotalk: '카카오톡',
  everytimeapp: '에브리타임',
  instagram: '인스타그램',
  line: '라인',
};

export const MainLogo = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [inAppBrowserName, setInAppBrowserName] = useState('');
  useEffect(() => {
    for (const [key, name] of Object.entries(IN_APP_BROWSER_NAMES)) {
      if (navigator.userAgent.toLowerCase().match(key)) {
        setIsInAppBrowser(true);
        setInAppBrowserName(name);
      }
    }
  }, []);

  return isInAppBrowser ? (
    <div className="warning-wrapper">
      <h1 style={{ marginBottom: '0px' }}>
        <strong>{inAppBrowserName}</strong> 브라우저에서는
      </h1>
      <h1 style={{ marginTop: '0px' }}>
        <strong>로그인</strong>이 실패할 수 있습니다
      </h1>
      <p style={{ marginBottom: '20px' }}>
        인앱 브라우저가 아닌 <strong>Chrome, Safari, 삼성 인터넷</strong> 등의 외부 브라우저를
        이용하면 더 안전합니다.
      </p>
      <InAppBrowserOutButton />
    </div>
  ) : (
    <div className="main-logo-wrapper">
      <MainLogoImage className="main-logo logo" width={1976} height={670} loading="eager" />
      <div className="main-subtitle">Seoul National University Computer Study Club</div>
    </div>
  );
};
