"use client";

import * as Button from "@/components/Button";
import { useLoginStore } from "@/state/LoginState";
import { goToHome, goToSignup } from "@/util/navigation";
import Divider from "@/components/Divider";
import React, { useEffect } from "react";
import "./page.css";

export default function LoginPage() {
  const loginStore = useLoginStore();

  useEffect(() => {
    if (loginStore.session_token && loginStore.login_token) {
      goToHome();
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.handleCredentialResponse = async (response) => {
      const { credential } = response;
      try {
        const payload = JSON.parse(
          decodeURIComponent(
            escape(window.atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
          )
        );
        const { email } = payload;

        if (!email) {
          alert("Google 계정에서 이메일을 가져올 수 없습니다.");
          return;
        }

        const res = await fetch("http://localhost:8080/api/user/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-api-secret": "some-secret-code",
          },
          body: JSON.stringify({
            frontend_secret: "some-secret-code",
            email,
          }),
        });

        if (res.status === 204) {
          const profileRes = await fetch("http://localhost:8080/api/user/profile", {
            method: "GET",
            credentials: "include",
            headers: { "x-api-secret": "some-secret-code" },
          });
          const profile = await profileRes.json();
          loginStore.setName(profile.name);
          loginStore.setId(profile.id);
          goToHome();
        } else if (res.status === 404) {
          alert("가입되지 않은 계정입니다. 회원가입을 진행해주세요.");
        } else {
          alert("로그인 실패 (코드: " + res.status + ")");
        }
      } catch (err) {
        console.error("Google 로그인 오류:", err);
        alert("Google 인증 중 오류 발생");
      }
    };
  }, []);

  return (
    <div id="LoginContainer">
      <form id="LoginForm">
        <h1>로그인</h1>
        <Divider />
        <div id="GoogleLoginContainer" className="mt-4">
          <div
            id="g_id_onload"
            data-client_id="832461792138-f6qpb4vn8knpi57a46p9a9ph7qvs92qh.apps.googleusercontent.com"
            data-callback="handleCredentialResponse"
            data-auto_prompt="false"
          ></div>
          <div
            className="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="outline"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-logo_alignment="left"
          ></div>
        </div>
        <div id="LoginButtonsContainer">
          <Button.Root type="button" onClick={() => goToSignup()}>
            회원가입
          </Button.Root>
        </div>
      </form>
    </div>
  );
}
