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
  
  useEffect(() => {
    if (useragt.match(/kakaotalk|line/i)) {
      setIsRedirectPossible(true);
    }
  }, [])

  const onClick = () => {
    if (useragt.match('kakaotalk')) {
      location.href = 'kakaotalk://web/openExternal?url='+encodeURIComponent(target_url);
    } else if (useragt.match('line')) {
      if(target_url.indexOf('?') !== -1){
				location.href = target_url+'&openExternalBrowser=1';
			}else{
				location.href = target_url+'?openExternalBrowser=1';
			}
    }
  }
  if (!isRedirectPossible) {
    if (!useragt.match('everytimeapp')) return;
    return <p>상단의 점 세 개 또는 화살표 아이콘(<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>) 클릭해서 외부 브라우저로 열기</p>
  }
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
        <p style={{"marginBottom": "20px"}}>인앱 브라우저가 아닌 <strong>Chrome, Safari, 삼성 인터넷</strong> 등의 외부 브라우저를 이용하면 더 안전합니다.</p>
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
