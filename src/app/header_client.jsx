"use client";

import { useEffect, useState } from "react";
import { getBaseUrl } from "@/util/getBaseUrl";

export default function HeaderClientArea() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    fetch(`${getBaseUrl()}/api/user/profile`, {
      headers: {
        "x-jwt": jwt,
        "x-api-secret": "some-secret-code",
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("jwt");
        setUser(null);
      });
  }, []);

  const isExecutive = user?.role >= 500;
  if (!user) {
    return (
      <button
        id="HeaderUserLogin"
        className="unset"
        onClick={() => (window.location.href = "/login")}
      >
        로그인
      </button>
    );
  }

  return (
    <>
      {isExecutive && (
        <button
          className="unset"
          onClick={() => (window.location.href = "/executive")}
        >
          운영진 페이지
        </button>
      )}
      <button
        id="HeaderUser"
        className="unset"
        onClick={() => (window.location.href = "/my-page")}
      >
        <span id="HeaderUserName">{user.name}</span>
        <img
          src="/vectors/user.svg"
          className="HeaderUserIcon"
          alt="User Icon"
        />
      </button>
    </>
  );
}
