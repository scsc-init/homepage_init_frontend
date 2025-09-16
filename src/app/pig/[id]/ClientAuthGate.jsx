"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientAuthGate({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const goLogin = () => {
      Promise.resolve().then(() => router.replace("/us/login"));
    };

    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      goLogin();
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/user/profile", {
          headers: { "x-jwt": jwt },
          cache: "no-store",
        });
        if (!res.ok) {
          goLogin();
          return;
        }
        if (!cancelled) setChecking(false); // 인증 통과 → 오버레이 해제
      } catch {
        goLogin();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <>
      {children}
      {checking && (
        <div className="AuthGateBackdrop">
          <div className="AuthGateSpinner" />
        </div>
      )}
    </>
  );
}
