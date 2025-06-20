"use client";

import React, { useState, useEffect, useRef } from "react";
import "./header.css";
import { goToLogin, goToMyPage } from "@/util/navigation";
import { useLoginStore } from "@/state/LoginState.jsx";
import UserIcon from "@@/vectors/user.svg";

const LogoIcon = () => (
  <button className="unset" onClick={() => (window.location.href = "/")}>
    <img
      src="/vectors/logo.svg"
      alt="SCSC Logo"
      style={{ width: "100px", height: "auto" }}
    />
  </button>
);
/*### About Us

- **SCSC**
- [ ] SCSC 역사 소개 페이지, Contact Us로 이동하는 기능이 있어야 함
- **Executives**
- [ ] 운영진 소개 페이지
- **Developers**
- [ ] 개발자 소개 페이지
- **Rules**
- [ ] 회칙 페이지

### Board

- **Project Archives / Album / Notice / More**
- [ ] 전체 게시판 조회 페이지
- [ ] 게시판 글 조회 페이지
- [ ] 게시판 글 작성 페이지
- [ ] 게시판 글 수정
- [ ] 게시판 글 검색 기능

### Sig/Pig

- **Sig**
- [ ] 시그 만들기 페이지
- [ ] 시그 접수 페이지
- [ ] 시그 접수 기능
- [ ] 시그 수요조사 기능
- [ ] 시그 소개글 조회 기능
- **Pig**
- [ ] 피그 조회 페이지
- [ ] 피그 접수 페이지
- [ ] 피그 접수 기능
- [ ] 피그 수요조사 기능
- [ ] 피그 소개글 조회 기능

### Contact

- **Contact Us**
- [ ] SCSC 위치, 전화번호 페이지
- **Join Us**
- [ ] SCSC 가입 페이지 리디렉션 */
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
  const loginStore = useLoginStore();
  const headerRef = useRef(null);
  const [spacerHeight, setSpacerHeight] = useState(null); // null → 조건부 적용을 위함

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
            <button id="HeaderUser" className="unset">
              {loginStore.login_token ? (
                <span id="HeaderUserName">{loginStore.name}</span>
              ) : (
                <div id="HeaderUserLogin" onClick={() => goToLogin()}>
                  로그인
                </div>
              )}
              <UserIcon
                className="HeaderUserIcon"
                onClick={() => goToMyPage()}
              />
            </button>
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
