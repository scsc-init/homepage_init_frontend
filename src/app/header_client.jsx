"use client";

import { useEffect, useState } from "react";
import { goToLogin, goToMyPage } from "@/util/navigation";
import UserIcon from "@@/vectors/user.svg";

export default function HeaderClientArea() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    fetch("http://localhost:8080/api/user/profile", {
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

  const isExecutive = user?.role === "executive" || user?.role === "president";

  if (!user) {
    return (
      <div id="HeaderUserLogin" onClick={goToLogin}>
        로그인
      </div>
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
      <button id="HeaderUser" className="unset" onClick={goToMyPage}>
        <span id="HeaderUserName">{user.name}</span>
        <UserIcon className="HeaderUserIcon" />
      </button>
    </>
  );
}
