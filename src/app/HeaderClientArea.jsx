"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { minExecutiveLevel } from "@/util/constants";

export default function HeaderClientArea() {
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsClient(true);
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;

      const res = await fetch(`/api/user/profile`, {
        headers: { "x-jwt": jwt },
      });
      if (res.ok) setUser(await res.json());
      else {
        localStorage.removeItem("jwt");
        setUser(null);
      }
    };

    fetchProfile();
  }, []);

  const isExecutive = user?.role >= minExecutiveLevel;

  // SSR 시 placeholder 렌더링 (공간 고정)
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
        width: "12rem",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "0.75rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {isExecutive && (
        <button
          className="unset"
          onClick={() => (window.location.href = "/executive")}
          style={{
            whiteSpace: "nowrap",
            fontSize: "0.875rem",
          }}
        >
          운영진 페이지
        </button>
      )}
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
    </div>
  );
}
