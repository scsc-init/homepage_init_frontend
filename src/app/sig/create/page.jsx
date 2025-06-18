// app/sig/create/page.jsx
"use client";

import { useEffect, useState } from "react";
import CreateSigClient from "./CreateSigClient";
import { useRouter } from "next/navigation";

export default function CreateSigPage() {
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    fetch("http://localhost:8080/api/user/profile", {
      headers: {
        "x-jwt": jwt,
        "x-api-secret": "some-secret-code",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("인증 실패");
        const user = await res.json();
        setUserId(user.id);
      })
      .catch((err) => {
        console.error("유저 인증 실패:", err);
        alert("로그인이 필요합니다.");
        router.push("/login");
      });
  }, []);

  if (!userId) return <p className="p-6">불러오는 중...</p>;

  return <CreateSigClient userId={userId} />;
}
