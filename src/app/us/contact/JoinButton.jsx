'use client';

import { useEffect, useState, useRef } from 'react';
import './page.css';

export default function JoinButton() {
  const [mode, setMode] = useState('unknown');
  const ref = useRef();

  useEffect(() => {
    fetch('/api/user/profile', { cache: 'no-store', credentials: 'include' })
      .then((r) => {
        if (r.ok) setMode('member');
        else setMode('guest');
      })
      .catch(() => setMode('guest'));
  }, []);

  const handleMouseEnter = (e) => {
    const btn = ref.current;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  };

  if (mode === 'unknown') return null;

  if (mode === 'guest') {
    return (
      <div className="ActivityBlock FadeInBlock" id="JoinUsSection">
        <div className="SectionHeader">JOIN US:</div>
        <p className="JoinDescription">
          SCSC에 관심 있으신가요? 아래 버튼을 눌러 가입 신청서를 작성해주세요.
        </p>
        <a href="/us/login" className="JoinButton" ref={ref} onMouseEnter={handleMouseEnter}>
          Join us!
        </a>
      </div>
    );
  }

  return (
    <div className="ActivityBlock FadeInBlock" id="JoinUsSection">
      <div className="SectionHeader">WELCOME:</div>
      <p className="JoinDescription">
        입금 안내와 카카오톡/디스코드 참여 링크는 환영 페이지에서 확인할 수 있습니다.
      </p>
      <a href="/about/welcome" className="JoinButton" ref={ref} onMouseEnter={handleMouseEnter}>
        환영 페이지로 이동
      </a>
    </div>
  );
}
