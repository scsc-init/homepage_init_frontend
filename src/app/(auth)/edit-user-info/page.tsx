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

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loginStore.session_token && loginStore.login_token) {
      goToHome();
    }
  }, []);

  const onLogin = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/auth/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status === 200) {
        loginStore.setSessionToken(data.session_token);
        loginStore.setLoginToken(data.login_token);
        loginStore.setId(data.id);

        await fetch(
          process.env.NEXT_PUBLIC_SERVER_URL + `/auth/user-info/${data.id}`,
          {
            method: "GET",
          }
        ).then(async (res) => {
          const data = await res.json();
          if (res.status === 200) {
            loginStore.setName(data.name);
          }
        });

        goToHome();
      } else {
        alert(`로그인에 실패했습니다. ${data.detail}`);
      }
    });
  };

  return (
    <div id="LoginContainer">
      <form id="LoginForm">
        <h1>로그인</h1>
        <Divider />
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
