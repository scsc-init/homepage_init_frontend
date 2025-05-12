"use client";

import * as Button from "@/components/Button";
import Card from "@/components/Card";
import joinClassName from "@/util/joinClassName";
import React, { useEffect, useRef, useState } from "react";
import "./page.css";

import { useRouter } from "next/navigation";
import Divider from "@/components/Divider";
import { useLoginStore } from "@/state/LoginState";
import Tag from "@/components/Tag";

const UserIcon = ({ className, ...props }: React.ComponentProps<"svg">) => {
  return (
    <svg
      className={joinClassName(className, "userIcon")}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 2a5 5 0 1 1-5 5l.005-.217A5 5 0 0 1 12 2m2 12a5 5 0 0 1 5 5v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1a5 5 0 0 1 5-5z" />
    </svg>
  );
};

const RightChevronIcon = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => {
  return (
    <svg
      className={joinClassName(className, "rightChevronIcon")}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m9 6l6 6l-6 6"
      />
    </svg>
  );
};

const RightChevronsIcon = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => {
  return (
    <svg
      className={joinClassName(className, "rightChevronsIcon")}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m7 7l5 5l-5 5m6-10l5 5l-5 5"
      />
    </svg>
  );
};

function SigCard({
  id,
  title,
  user_count,
  content,
  user,
  type,
  ftf,
  joined = false,
}: {
  id: number;
  title: string;
  user_count: number;
  content: string;
  user: string;
  type: string;
  ftf: boolean;
  joined?: boolean;
}) {
  const router = useRouter();

  return (
    <Card
      hoverGlow
      className="sigCard"
      onClick={() => router.push("/sig/details/" + id)}
    >
      <div className="sigTopbar">
        <b className="sigTitle">{title}</b>
        <Tag>{type}</Tag>
        <Tag>{ftf ? "대면" : "비대면"}</Tag>
        <div className="sigUserName">{user}</div>
        <div className="sigUserCountContainer">
          <UserIcon className="sigIcon" />
          <span className="sigUserCount">{user_count}</span>
        </div>
      </div>
      <div
        className={joinClassName(
          "sigJoinedState",
          joined ? "joined" : "notJoined"
        )}
      >
        {joined ? "신청 완료" : "신청하지 않음"}
      </div>
      <div className="sigEnter">
        <RightChevronIcon />
      </div>
      <div>{content}</div>
    </Card>
  );
}

export default function Page() {
  const router = useRouter();
  const loginStore = useLoginStore();
  const [data, setData] = useState<any>(null);
  const fetchedRef = useRef(false);

  console.log();

  useEffect(() => {
    if (fetchedRef.current) return;
    if (!loginStore.id) return;
    fetchedRef.current = true;

    const fetchData = async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVER_URL + "/sig/list",
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
          const jsonData = await res.json();
          setData(jsonData);
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
  }, [loginStore]);

  return (
    <div id="SigListContainer">
      <div id="SigList">
        <h1>시그 리스트</h1>
        <br />
        <Button.Root
          id="SigCreateButton"
          onClick={() => router.push("/sig/create")}
        >
          시그 만들기 <RightChevronsIcon />
        </Button.Root>
        <Divider />
        {data &&
          data.map((sig: any) => (
            <SigCard
              key={sig.id}
              id={sig.id}
              title={sig.name}
              user={sig.user_name}
              user_count={sig.user_count}
              content={sig.short_description}
              joined={sig.joined}
              type={sig.type}
              ftf={sig.ftf}
            />
          ))}
      </div>
    </div>
  );
}
