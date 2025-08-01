"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import HeaderClientArea from "./HeaderClientArea";
import "./header.css";

const SEMESTER_MAP = { 1: "1", 2: "S", 3: "2", 4: "W" };

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

export default function Header({ year, semester }) {
  const headerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const timeoutRef = useRef();

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const handleResize = () => setWindowWidth(window.innerWidth);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isMobile = windowWidth !== null && windowWidth < 768;

  const handleMouseEnter = (index) => {
    clearTimeout(timeoutRef.current);
    setOpenIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenIndex(null), 300);
  };

  return (
    <>
      <div id="HeaderContainer" ref={headerRef}>
        <div id="Header">
          <div id="HeaderLeft">
            <button
              className="unset"
              onClick={() => (window.location.href = "/")}
            >
              <Image
                src="/vectors/logo.svg"
                alt="SCSC Logo"
                width={100}
                height={40}
                className="logo"
              />
            </button>
            {year && semester && (
              <div className="toAdminPageButton">
                {year} - {SEMESTER_MAP[semester]}학기
              </div>
            )}
          </div>

          {isMounted && !isMobile && (
            <div id="HeaderCenter">
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
                            <button
                              onClick={() => (window.location.href = item.url)}
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div id="HeaderRight" style={{ minWidth: "12rem" }}>
            {isMounted && isMobile ? (
              <>
                <HeaderClientArea
                  allowAnonymous={true}
                  showMyPageInline={true}
                />
                <button
                  className="HamburgerButton"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  ☰
                </button>
              </>
            ) : (
              isMounted && <HeaderClientArea />
            )}
          </div>
        </div>

        {isMounted && isMobile && (
          <div className={`MobileMenuWrapper ${menuOpen ? "open" : ""}`}>
            <div className="MobileMenu">
              <ul className="MobileMenuList">
                {menuData.map((menu, index) => (
                  <li className="MobileMenuItem" key={menu.title}>
                    <button
                      className="MobileMenuTrigger"
                      onClick={() =>
                        setOpenIndex((prev) => (prev === index ? null : index))
                      }
                    >
                      {menu.title}
                    </button>
                    <div
                      className={`MobileSubMenu ${openIndex === index ? "open" : ""}`}
                    >
                      <ul>
                        {menu.items.map((item) => (
                          <li key={item.label}>
                            <button
                              onClick={() => (window.location.href = item.url)}
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
              <HeaderClientArea allowAnonymous={false} onlyExecutive={true} />
            </div>
          </div>
        )}
      </div>

      <div id="HeaderSpacer" style={{ height: "3.5rem" }} />
    </>
  );
}
