"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function PigJoinLeaveButton({ pigId }) {
  const [isMember, setIsMember] = useState(false);
  const [user, setUser] = useState();
  const [members, setMembers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
    }

    const fetchProfile = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;

      const res = await fetch(`/api/user/profile`, {
        headers: { "x-jwt": jwt },
      });
      if (res.ok) setUser(await res.json());
    };
    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch(`/api/pig/${pigId}/members`);
      if (res.ok) setMembers(await res.json());
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!user || !members) return;
    setIsMember(members.some((m) => m.user_id === user.id));
  }, [user, members]);

  const onClickJoinBtn = async () => {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`/api/pig/${pigId}/member/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
    });

    if (res.ok) {
      alert("가입 성공");
    } else {
      const err = await res.json();
      alert("PIG 가입 실패: " + (err.detail ?? JSON.stringify(err)));
    }
  };

  const onClickLeaveBtn = async () => {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`/api/pig/${pigId}/member/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
    });

    if (res.ok) {
      alert("탈퇴 성공");
    } else {
      const err = await res.json();
      alert("PIG 탈퇴 실패: " + (err.detail ?? JSON.stringify(err)));
    }
  };

  return !user || !members ? (
    ""
  ) : isMember === false ? (
    <button onClick={onClickJoinBtn}>시그 가입하기</button>
  ) : (
    <button onClick={onClickLeaveBtn}>시그 탈퇴하기</button>
  );
}
