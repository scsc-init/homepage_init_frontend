'use client';

import "./page.css";
import { useEffect, useState } from "react";

const IN_APP_BROWSER_NAMES = {
  "KAKAOTALK": "카카오톡"
}

export const checkInAppBrowser = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [inAppBrowserName, setInAppBrowserName] = useState('');
  useEffect(() => {
    for (const [key, name] of Object.entries(IN_APP_BROWSER_NAMES)) {
      if (navigator.userAgent.match(key)) {setIsInAppBrowser(true); setInAppBrowserName(name); }
    }
  },[])
  return inAppBrowserName
}

export const MainLogo = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [inAppBrowserName, setInAppBrowserName] = useState('');
  useEffect(() => {
    for (const [key, name] of Object.entries(IN_APP_BROWSER_NAMES)) {
      if (navigator.userAgent.match(key)) {setIsInAppBrowser(true); setInAppBrowserName(name); }
    }
  },[])
  
  return (
    isInAppBrowser ? (
      <div>{inAppBrowserName}</div>
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
