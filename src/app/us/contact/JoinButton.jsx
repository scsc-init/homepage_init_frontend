'use client';

import { useEffect, useState, useRef } from 'react';
import './page.css';

export default function JoinButton() {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      setShow(true);
    }
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

  if (!show) return null;

  return (
    <div className="ActivityBlock FadeInBlock" id="JoinUsSection">
      <div className="SectionHeader">JOIN US:</div>
      <p className="JoinDescription">
        SCSC에 관심 있으신가요? 아래 버튼을 눌러 가입 신청서를 작성해주세요.
      </p>
      <a href="./login" className="JoinButton" ref={ref} onMouseEnter={handleMouseEnter}>
        Join us!
      </a>
    </div>
  );
}
