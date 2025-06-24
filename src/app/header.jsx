// header.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import "./header.css";
import HeaderClientArea from "./header_client"; // ✅ 추가

const LogoIcon = () => (
  <button className="unset" onClick={() => (window.location.href = "/")}>
    <img
      src="/vectors/logo.svg"
      alt="SCSC Logo"
      style={{ width: "100px", height: "auto" }}
    />
  </button>
);

const menuData = [
  {
    title: "About us",
    items: [
      { label: "SCSC", url: "/about" },
      { label: "Executives", url: "/about/executive" },
      { label: "Developers", url: "/about/developer" },
      { label: "Rules", url: "/rules" },
    ],
  },
  {
    title: "Board",
    items: [
      { label: "Project Archives", url: "/board/3" },
      { label: "Album", url: "/board/4" },
      { label: "Notice", url: "/board/5" },
    ],
  },
  {
    title: "SIG/PIG",
    items: [
      { label: "SIG", url: "/sig" },
      { label: "PIG", url: "/pig" },
    ],
  },
  {
    title: "Contact",
    items: [
      { label: "Contact Us!", url: "/us/contact" },
      { label: "Join Us!", url: "/signup" },
    ],
  },
];

function HeaderNavigation() {
  const [openIndex, setOpenIndex] = useState(null);
  const timeoutRef = useRef();

  const handleMouseEnter = (index) => {
    clearTimeout(timeoutRef.current);
    setOpenIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenIndex(null);
    }, 200);
  };

  return (
    <ul id="HeaderMenuList">
      {menuData.map((menu, index) => (
        <li
          className="HeaderMenuItem"
          key={menu.title}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <button className="HeaderMenuTrigger">{menu.title}</button>
          <div
            className={`HeaderMenuContent ${openIndex === index ? "open" : ""}`}
          >
            <ul>
              {menu.items.map((item) => (
                <li key={item.label}>
                  <button onClick={() => (window.location.href = item.url)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Header() {
  const headerRef = useRef(null);
  const [spacerHeight, setSpacerHeight] = useState(null);

  useEffect(() => {
    if (headerRef.current) {
      setSpacerHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <div id="HeaderContainer" ref={headerRef}>
        <div id="Header">
          <div id="HeaderLeft">
            <LogoIcon />
          </div>
          <div id="HeaderCenter">
            <HeaderNavigation />
          </div>
          <div id="HeaderRight">
            <HeaderClientArea /> {/* ✅ 사용자 영역만 클라이언트에서 렌더링 */}
          </div>
        </div>
      </div>
      <div
        id="HeaderSpacer"
        style={
          spacerHeight !== null ? { height: `${spacerHeight}px` } : undefined
        }
      />
    </>
  );
}
