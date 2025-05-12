"use client";

import * as Input from "@/components/Input";
import * as Button from "@/components/Button";
import { useLoginStore } from "@/state/LoginState";
import { goToHome, goToLogin } from "@/util/navigation";
import Divider from "@/components/Divider";
import React, { useEffect } from "react";

import "./page.css";

export default function LoginPage() {
  const loginStore = useLoginStore();

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [sigList, setSigList] = React.useState([]);

  useEffect(() => {
    // if (!loginStore.session_token || !loginStore.login_token) {
    //   goToLogin();
    // }
    getSigList();
  }, []);

  const getSigList = async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SERVER_URL + "/sig/list",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: {
            login_token: loginStore.login_token,
          },
          conn: {
            session_token: loginStore.session_token,
          },
        }),
      }
    );

    const data = await response.json();

    console.log(data);
  };

  return (
    <div id="MyPageContainer">
      <div id="MyPage">
        <h1>회원 정보</h1>
        <Divider />
        <p>ID: {loginStore.name}</p>
        {/* <p>Email: {loginStore.email}</p> */}
        {/* <p>Major: {}</p> */}
        <Divider />
        <h1>가입된 시그</h1>
      </div>
    </div>
  );
}
