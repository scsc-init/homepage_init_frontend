"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PigJoinLeaveButton({ pigId, initialIsMember = false }) {
  const router = useRouter();
  const [isMember, setIsMember] = useState(!!initialIsMember);
  const [pending, setPending] = useState(false);

  const ensureJwt = () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      alert("로그인이 필요합니다.");
      router.replace("/us/login");
    }
    return jwt;
  };

  const readError = async (res) => {
    const base = `HTTP ${res.status}`;
    const ct = res.headers.get("content-type") || "";
    try {
      if (ct.includes("application/json")) {
        const body = await res.json();
        const detail = body?.detail ?? body?.message ?? body?.error;
        return detail
          ? `${base} - ${detail}`
          : `${base} - ${JSON.stringify(body)}`;
      } else {
        const text = await res.text();
        return text ? `${base} - ${text}` : base;
      }
    } catch {
      return base;
    }
  };

  const join = async () => {
    const jwt = ensureJwt();
    if (!jwt) return;
    try {
      setPending(true);
      const res = await fetch(`/api/pig/${pigId}/member/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-jwt": jwt },
      });
      if (res.ok) {
        alert("PIG 가입 성공!");
        setIsMember(true);
        router.refresh();
      } else {
        alert("PIG 가입 실패: " + (await readError(res)));
      }
    } catch (e) {
      alert("PIG 가입 실패: " + (e?.message || "네트워크 오류"));
    } finally {
      setPending(false);
    }
  };

  const leave = async () => {
    const jwt = ensureJwt();
    if (!jwt) return;
    try {
      setPending(true);
      const res = await fetch(`/api/pig/${pigId}/member/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-jwt": jwt },
      });
      if (res.ok) {
        alert("PIG 탈퇴 성공!");
        setIsMember(false);
        router.refresh();
      } else {
        alert("PIG 탈퇴 실패: " + (await readError(res)));
      }
    } catch (e) {
      alert("PIG 탈퇴 실패: " + (e?.message || "네트워크 오류"));
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      className={`PigButton ${isMember ? "is-leave" : "is-join"}`}
      onClick={isMember ? leave : join}
      disabled={pending}
      aria-busy={pending}
    >
      {isMember ? "피그 탈퇴하기" : "피그 가입하기"}
    </button>
  );
}
