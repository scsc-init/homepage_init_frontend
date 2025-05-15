
"use client";

import * as Input from "@/components/Input";
import * as Button from "@/components/Button";
import { useLoginStore } from "@/state/LoginState";
import { goToHome, goToSignup } from "@/util/navigation";
import "./page.css";
import Divider from "@/components/Divider";
import React, { useEffect } from "react";

export default function LoginPage() {
  const loginStore = useLoginStore();

  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  useEffect(() => {
    if (loginStore.session_token && loginStore.login_token) {
      goToHome();
    }
  }, []);

  const onLogin = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    console.log("호출확인");
    const res = await fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      credentials: "include", // ✅ 세션 쿠키 저장
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": "some-secret-code", // ✅ 반드시 필요
      },
      body: JSON.stringify({
        frontend_secret: "some-secret-code",
        email,
      }),
    });
    console.log(res.status);
    if (res.status === 204) {
      // 로그인 성공 → 사용자 정보 가져오기
      alert("로그인 성공");
      const profileRes = await fetch("http://localhost:8080/api/user/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "x-api-secret": "some-secret-code",
        },
      });

      if (profileRes.status === 200) {
        const profile = await profileRes.json();
        loginStore.setName(profile.name);
        loginStore.setId(profile.id);
        goToHome();
      } else {
        alert("로그인 후 사용자 정보를 불러오지 못했습니다.");
      }
    } else if (res.status === 404) {
      alert("존재하지 않는 이메일입니다.");
    } else if (res.status === 401) {
      alert("API 인증에 실패했습니다.");
    } else {
      alert(`로그인 실패 (${res.status})`);
    }
  };


  return (
    <div id="LoginContainer">
      <form id="LoginForm">
        <h1>로그인</h1>
        <Divider />
        <div id="LoginInfo">
          <Input.Root>
            <Input.Label htmlFor="Email">스누메일</Input.Label>
            <Input.Input
              id="Email"
              placeholder="jonggangjoajoa@snu.ac.kr"
              ref={emailRef}
            />
          </Input.Root>
          <Input.Root>
            <Input.Label htmlFor="Password">비밀번호</Input.Label>
            <Input.Input
              id="Password"
              type="password"
              placeholder="123456"
              ref={passwordRef}
            />
          </Input.Root>
        </div>
        <Divider />
        <div id="LoginButtonsContainer">
          <Button.Root type="button" onClick={onLogin}>
            로그인
          </Button.Root>
          <Button.Root type="button" onClick={() => goToSignup()}>
            회원가입
          </Button.Root>
        </div>
      </form>
    </div>
  );
}
