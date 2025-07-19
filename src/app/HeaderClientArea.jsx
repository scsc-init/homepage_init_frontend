"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeaderClientArea() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user/profile`, {
          headers: { "x-jwt": jwt },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("jwt");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const isExecutive = user?.role >= 500;

  if (loading) {
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

  // 🔹 로그인 X
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

  // 🔹 로그인 O
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
          style={{ fontSize: "0.875rem" }}
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
