"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function SigDeleteButton({ sigId, canDelete, isOwner }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

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

  const deleteBySelf = async () => {
    const jwt = ensureJwt();
    if (!jwt) return;
    try {
      setPending(true);
      const res = await fetch(`/api/sig/${sigId}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-jwt": jwt },
      });
      if (res.ok) {
        alert("SIG 비활성화 성공!");
        router.refresh();
      } else {
        alert("SIG 비활성화 실패: " + (await readError(res)));
      }
    } catch (e) {
      alert("SIG 비활성화 실패: " + (e?.message || "네트워크 오류"));
    } finally {
      setPending(false);
    }
  };

  const deleteByExec = async () => {
    const jwt = ensureJwt();
    if (!jwt) return;
    try {
      setPending(true);
      const res = await fetch(`/api/sig/${sigId}/delete/executive`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-jwt": jwt },
      });
      if (res.ok) {
        alert("SIG 비활성화 성공!");
        router.refresh();
      } else {
        alert("SIG 비활성화 실패: " + (await readError(res)));
      }
    } catch (e) {
      alert("SIG 비활성화 실패: " + (e?.message || "네트워크 오류"));
    } finally {
      setPending(false);
    }
  };


  return canDelete ? (
    <button
      type="button"
      className={`SigButton is-delete`}
      onClick={isOwner ? deleteBySelf : deleteByExec}
      disabled={pending}
      aria-busy={pending}
    >
      {"시그 비활성화"}
    </button>
  ) : null;
}
