"use client";

import { useEffect, useRef, useState } from "react";
import "./header.css";
import HeaderClientArea from "./HeaderClientArea";
import Image from "next/image";

const SEMESTER_MAP = {
  1: "1",
  2: "S",
  3: "2",
  4: "W",
};

export const LogoIcon = ({ year, semester }) => (
  <>
    <button className="unset" onClick={() => (window.location.href = "/")}>
      <Image src="/vectors/logo.svg" alt="SCSC Logo" width={100} height={40} />
    </button>
    {!year || !semester ? null : (
      <div>
        {year} - {SEMESTER_MAP[semester]}학기
      </div>
    )}
  </>
);

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

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

function LoginOrMyPageButton() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    fetch("/api/user/profile", {
      headers: { "x-jwt": jwt },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => localStorage.removeItem("jwt"));
  }, []);

  if (!isClient) return <div style={{ width: "5rem" }} />;

  if (!user) {
    return (
      <button
        id="HeaderUserLogin"
        className="unset"
        onClick={() => (window.location.href = "/us/login")}
      >
        로그인
      </button>
    );
  }

  return (
    <button
      id="HeaderUser"
      className="unset"
      onClick={() => (window.location.href = "/about/my-page")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        fontSize: "0.95rem",
      }}
    >
      {user.name}
      <Image
        src="/vectors/user.svg"
        className="HeaderUserIcon"
        alt="User Icon"
        width={24}
        height={24}
      />
    </button>
  );
}

export default function Header({ year, semester }) {
  const headerRef = useRef(null);
  const [spacerHeight, setSpacerHeight] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (headerRef.current) {
      setSpacerHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <div id="HeaderContainer" ref={headerRef}>
        <div id="Header">
          <div id="HeaderLeft">
            <LogoIcon year={year} semester={semester} />
          </div>

          {isClient && !isMobile && (
            <div id="HeaderCenter">
              <HeaderNavigation />
            </div>
          )}

          <div id="HeaderRight">
            {isClient && isMobile && <LoginOrMyPageButton />}
            {isClient && isMobile && (
              <button
                className="HamburgerButton"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                ☰
              </button>
            )}
            {isClient && !isMobile && <HeaderClientArea />}
          </div>
        </div>

        {isClient && isMobile && menuOpen && (
          <div className="MobileMenu">
            <HeaderNavigation />
            <HeaderClientArea />
          </div>
        )}
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
