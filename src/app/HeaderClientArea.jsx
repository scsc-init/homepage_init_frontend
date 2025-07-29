"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { minExecutiveLevel } from "@/util/constants";

export default function HeaderClientArea() {
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [width, setWidth] = useState(9999);

  useEffect(() => {
    setIsClient(true);

    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      fetch(`/api/user/profile`, {
        headers: { "x-jwt": jwt },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem("jwt");
          setUser(null);
        });
    }

    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width < 768;
  const isExecutive = user?.role >= minExecutiveLevel;

  if (!isClient) {
    return (
      <div
        style={{
          width: "12rem",
          display: "flex",
          justifyContent: "flex-end",
        }}
        aria-hidden
      >
        &nbsp;
      </div>
    );
  }

  if (!user) {
    // 로그인하지 않은 경우: 모바일이면 숨김, 데스크탑이면 로그인 버튼 표시
    if (isMobile) return null;

    return (
      <div
        style={{
          width: "12rem",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <button
          id="HeaderUserLogin"
          className="unset"
          onClick={() => (window.location.href = "/us/login")}
        >
          로그인
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: isMobile ? "auto" : "12rem",
        display: "flex",
        justifyContent: isMobile ? "flex-start" : "flex-end",
        alignItems: "center",
        gap: "0.75rem",
        whiteSpace: "nowrap",
      }}
    >
      {isExecutive && (
        <button
          className="unset"
          onClick={() => (window.location.href = "/executive")}
          style={{
            fontSize: "0.875rem",
          }}
        >
          운영진 페이지
        </button>
      )}

      {!isMobile && (
        <button
          id="HeaderUser"
          className="unset"
          onClick={() => (window.location.href = "/about/my-page")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            overflow: "hidden",
          }}
        >
          <span
            id="HeaderUserName"
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              maxWidth: "5rem",
              whiteSpace: "nowrap",
            }}
          >
            {user.name}
          </span>
          <Image
            src="/vectors/user.svg"
            className="HeaderUserIcon"
            alt="User Icon"
            width={24}
            height={24}
          />
        </button>
      )}
    </div>
  );
}
