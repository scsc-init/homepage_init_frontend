'use client';

import React, { useEffect, useRef, useState } from "react";
import "./header.css";
import HeaderClientArea from "./HeaderClientArea";
import Image from "next/image";

export const LogoIcon = ({year, semester}) => {return (
  <>
    <button className="unset" onClick={() => (window.location.href = "/")}>
      <Image src="/vectors/logo.svg" alt="SCSC Logo" width={100} height={40} />
    </button>
    {(!year || !semester) ? <div></div> : <div>{year} - {SEMESTER_MAP[semester]}학기</div>}
  </>
);}

const menuData = [
  {
    title: "About us",
    items: [
      { label: "SCSC", url: "/about" },
      { label: "Executives", url: "/about/executives" },
      { label: "Developers", url: "/about/developers" },
      { label: "Rules", url: "/about/rules" },
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
      { label: "Join Us!", url: "/us/login" },
    ],
  },
];

const SEMESTER_MAP = {
  1: "1",
  2: "S",
  3: "2",
  4: "W",
}

export function HeaderNavigation() {
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

export default function Header({year, semester}) {
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
            <LogoIcon year={year} semester={semester}/>
          </div>
          <div id="HeaderCenter">
            <HeaderNavigation />
          </div>
          <div id="HeaderRight">
            <HeaderClientArea />
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
