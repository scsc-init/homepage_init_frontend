"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { minExecutiveLevel } from "@/util/constants";
import "./header.css"

export default function HeaderClientArea({
  allowAnonymous = true,
  onlyExecutive = false,
  showMyPageInline = false,
}) {
  const [user, setUser] = useState(undefined);
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 9999,
  );

  useEffect(() => {
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
    } else {
      setUser(null);
    }

    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width < 768;
  const isExecutive = user?.role >= minExecutiveLevel;

  if (user === undefined) {
    return (
      <div style={{ width: isMobile ? "auto" : "12rem", height: "2rem" }} />
    );
  }

  if (!user) {
    if (!allowAnonymous) return null;
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          id="HeaderUserLogin"
          className="unset"
          onClick={() => (window.location.href = "/us/login")}
          style={{ fontSize: "0.9rem" }}
        >
          로그인
        </button>
      </div>
    );
  }

  if (isMobile && showMyPageInline) {
    return (
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
        <img
          src={user.profile_picture ? user.profile_picture : "/main/default-pfp.png"}
          alt="Profile" 
          className="user-profile-picture"
        />
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
      </button>
    );
  }

  if (onlyExecutive && isExecutive) {
    return (
      <button
        className="unset toAdminPageButton"
        onClick={() => (window.location.href = "/executive")}
        style={{
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
        }}
      >
        운영진 페이지
      </button>
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
      {!isMobile && isExecutive && (
        <button
          className="unset toAdminPageButton"
          onClick={() => (window.location.href = "/executive")}
          style={{ fontSize: "0.875rem" }}
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
          <img
            src={user.profile_picture ? user.profile_picture : "/main/default-pfp.png"}
            alt="Profile" 
            className="user-profile-picture"
          />
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
        </button>
      )}
    </div>
  );
}
