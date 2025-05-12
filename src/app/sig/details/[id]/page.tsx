"use client";

import Markdown from "marked-react";
import React, { useEffect, useRef, useState } from "react";
import * as Button from "@/components/Button";
import Divider from "@/components/Divider";
import { useRouter } from "next/navigation";
import { useLoginStore } from "@/state/LoginState";
import { goToSigList } from "@/util/navigation";
import "./page.css";

export default function Page({ params }: { params: { id: string } }) {
  const loginStore = useLoginStore();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [usersData, setUsersData] = useState<any>(null);
  const [joined, setJoined] = useState<boolean>(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    if (!loginStore.id) return;
    fetchedRef.current = true;

    const fetchData = async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVER_URL + "/sig/" + params.id,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          const jsonData = await res.json();
          setData(jsonData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }

      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVER_URL + "/sig/" + params.id + "/users",
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          const jsonData = await res.json();
          setUsersData(jsonData);
        } else if (
          res.status === 400 &&
          (await res.json()).detail === "invalid_login_token"
        ) {
          loginStore.logout();
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }

      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVER_URL + "/sig/" + params.id + "/joined",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              login_token: loginStore.login_token,
            }),
          }
        );
        if (res.status === 200) {
          setJoined(await res.json());
        } else if (
          res.status === 400 &&
          (await res.json()).detail === "invalid_login_token"
        ) {
          loginStore.logout();
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  });

  const joinSig = async () => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URL + "/sig/" + params.id + "/join",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login_token: loginStore.login_token,
          }),
        }
      );

      if (res.status === 200) {
        setJoined(true);
        usersData.push(loginStore.name);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const leaveSig = async () => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URL + "/sig/" + params.id + "/leave",
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login_token: loginStore.login_token,
          }),
        }
      );

      if (res.status === 200) {
        setJoined(false);
        for (let i = 0; i < usersData.length; i++) {
          if (usersData[i] === loginStore.name) {
            usersData.splice(i, 1);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <div id="DetailsContainer">
      <div id="Details">
        <h1>{data ? data.name : "제목"}</h1>
        <Markdown>{data ? data.description : "내용"}</Markdown>
        <Divider />총 {usersData ? Object.keys(usersData).length : "n"}명이
        신청했습니다.
        <br /> {usersData && usersData.map((user: any) => user).join(", ")}
        <Divider />
        <div id="DetailsButtons">
          {!joined ? (
            <Button.Root onClick={() => joinSig()}>신청하기</Button.Root>
          ) : (
            <Button.Root onClick={() => leaveSig()}>취소하기</Button.Root>
          )}
          <Button.Root onClick={() => goToSigList()}>뒤로가기</Button.Root>
        </div>
      </div>
    </div>
  );
}
