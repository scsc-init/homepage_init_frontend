'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function InAppBrowserOutButton() {
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
