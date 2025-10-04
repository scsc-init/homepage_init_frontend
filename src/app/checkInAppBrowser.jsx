'use client';

import './page.css';
import { useEffect, useState } from 'react';

const IN_APP_BROWSER_NAMES = {
  kakaotalk: '카카오톡',
  everytimeapp: '에브리타임',
  instagram: '인스타그램',
  line: '라인',
};

function InAppBrowserOutButton() {
  const [isRedirectPossible, setIsRedirectPossible] = useState(false);
  const useragt = navigator.userAgent.toLowerCase();

  useEffect(() => {
    if (useragt.match(/kakaotalk|line/i)) {
      setIsRedirectPossible(true);
    }
  }, [useragt]);

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
    if (useragt.match(/ios|ipad|ipod/i)) {
      return (
        <p>
          상단의 화살표 아이콘({' '}
          <img
            src="/vectors/open-external-link-icon.svg"
            width="12px"
            height="12px"
            className="ico"
            alt="arrow button"
          ></img>{' '}
          ) 클릭 &rarr; 외부 브라우저로 열기
        </p>
      );
    } else {
      return <p>상단의 점 세 개( ⋮ ) 클릭 &rarr; 외부 브라우저로 열기</p>;
    }
  }

  return <button onClick={onClick}>외부 브라우저로 이동</button>;
}

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
      <img src="/main/main-logo.png" alt="Main Logo" className="main-logo logo" />
      <div className="main-subtitle">Seoul National University Computer Study Club</div>
    </div>
  );
};
