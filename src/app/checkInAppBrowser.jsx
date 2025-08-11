'use client';

import "./page.css";
import { useEffect, useState } from "react";

const IN_APP_BROWSER_NAMES = {
  "kakaotalk": "카카오톡",
  "everytimeapp": "에브리타임",
  "instagram": "인스타그램",
  "line": "라인"
}


function InAppBrowserOutButton() {
  const [isRedirectPossible, setIsRedirectPossible] = useState(false);
  const useragt = navigator.userAgent.toLowerCase();
	const target_url = location.href;

  const onClick = () => {
    if (useragt.match(/kakaotalk/i)) {
      setIsRedirectPossible(true);
      location.href = 'kakaotalk://web/openExternal?url='+encodeURIComponent(target_url);
    } else if (useragt.match(/line/i)) {
      setIsRedirectPossible(true);
      if(target_url.indexOf('?') !== -1){
				location.href = target_url+'&openExternalBrowser=1';
			}else{
				location.href = target_url+'?openExternalBrowser=1';
			}
    } else if (useragt.match(/everytimeapp/i)) {
      setIsRedirectPossible(true);
      location.href = 'kakaotalk://web/openExternal?url='+encodeURIComponent(target_url);
    }
  }
  if (!isRedirectPossible) return;
  return <button onClick={onClick}>외부 브라우저로 이동</button>
};

export const MainLogo = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [inAppBrowserName, setInAppBrowserName] = useState('');
  useEffect(() => {
    for (const [key, name] of Object.entries(IN_APP_BROWSER_NAMES)) {
      if (navigator.userAgent.toLowerCase().match(key)) {setIsInAppBrowser(true); setInAppBrowserName(name);}
    }
  },[])
  
  return (
    isInAppBrowser ? (
      <div className="main-logo-wrapper">
        <h1><strong>{inAppBrowserName}</strong> 브라우저에서는 <strong>로그인</strong>이 실패할 수 있습니다</h1>
        <p>인앱 브라우저가 아닌 <strong>Chrome, Safari, 삼성 인터넷</strong> 등의 외부 브라우저를 이용하면 더 안전합니다.</p>
        <InAppBrowserOutButton/>
      </div>
    ) : (
      <div className="main-logo-wrapper">
        <img
          src="/main/main-logo.png"
          alt="Main Logo"
          className="main-logo logo"
        />
        <div className="main-subtitle">
          Seoul National University Computer Study Club
        </div>
      </div>
    )
  )
}
